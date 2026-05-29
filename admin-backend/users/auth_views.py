from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
import secrets
import threading
from django.contrib.auth import get_user_model

User = get_user_model()

# In-memory OTP store: {email: code}
# For production use Redis or DB — this works fine for single-server dev
_reset_codes = {}


@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'error': 'Username and password required.'}, status=400)

    # Allow login with email too
    if '@' in username:
        try:
            user_obj = User.objects.get(email=username)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({'error': 'Invalid username or password.'}, status=401)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error': 'Invalid username or password.'}, status=401)

    if not user.is_staff and not user.is_superuser:
        return Response({'error': 'You do not have admin access.'}, status=403)

    # Simple token — username + secret (stateless, good for dev)
    token = f"{user.id}:{secrets.token_hex(16)}"

    role = 'superuser' if user.is_superuser else 'admin'

    return Response({
        'token': token,
        'username': user.username,
        'email': user.email,
        'role': role,
        'message': 'Login successful.',
    })


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email', '').strip()

    if not email:
        return Response({'error': 'Email is required.'}, status=400)

    try:
        # Use filter().first() to avoid MultipleObjectsReturned error
        user = User.objects.filter(email=email, is_staff=True).first()
        if not user:
            user = User.objects.filter(email=email).first()
        if not user:
            return Response({'message': 'If this email is registered, a code has been sent.'})
    except Exception:
        return Response({'message': 'If this email is registered, a code has been sent.'})

    if not user.is_staff and not user.is_superuser:
        return Response({'error': 'This email does not have admin access.'}, status=403)

    # Generate 6-digit code
    code = str(secrets.randbelow(900000) + 100000)
    _reset_codes[email] = code

    # Send email in background
    def send_reset():
        try:
            send_mail(
                subject='Astro Annie Admin — Password Reset Code',
                message=f"""Hello {user.username},

Your password reset code is:

  {code}

This code is valid for this session only.
If you did not request this, please ignore this email.

— Astro Annie Admin
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception:
            pass

    threading.Thread(target=send_reset, daemon=True).start()

    return Response({'message': 'Reset code sent to your email.'})


@api_view(['POST'])
def reset_password(request):
    email        = request.data.get('email', '').strip()
    code         = request.data.get('code', '').strip()
    new_password = request.data.get('new_password', '')

    if not email or not code or not new_password:
        return Response({'error': 'Email, code and new password are required.'}, status=400)

    if len(new_password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=400)

    # Verify code
    stored = _reset_codes.get(email)
    if not stored or stored != code:
        return Response({'error': 'Invalid or expired reset code.'}, status=400)

    try:
        user = User.objects.filter(email=email, is_staff=True).first()
        if not user:
            user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found.'}, status=404)
    except Exception:
        return Response({'error': 'User not found.'}, status=404)

    user.set_password(new_password)
    user.save()

    # Remove used code
    _reset_codes.pop(email, None)

    return Response({'message': 'Password reset successfully. Please log in.'})


# ─────────────────────────── ADMIN MANAGEMENT (Superuser only) ───────────────────────────

def is_superuser_request(request):
    """Check if request has valid superuser token."""
    token = request.headers.get('Authorization', '')
    if not token:
        return None
    try:
        user_id = int(token.split(':')[0])
        user = User.objects.get(id=user_id, is_superuser=True)
        return user
    except Exception:
        return None


@api_view(['GET'])
def list_admins(request):
    su = is_superuser_request(request)
    if not su:
        return Response({'error': 'Superuser access required.'}, status=403)
    admins = User.objects.filter(is_staff=True).values('id','username','email','is_superuser','first_name','last_name')
    return Response(list(admins))


@api_view(['POST'])
def create_admin(request):
    su = is_superuser_request(request)
    if not su:
        return Response({'error': 'Superuser access required.'}, status=403)

    username  = request.data.get('username','').strip()
    email     = request.data.get('email','').strip()
    password  = request.data.get('password','')
    full_name = request.data.get('full_name','').strip()

    if not username or not email or not password:
        return Response({'error': 'Username, email and password required.'}, status=400)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': f'Username "{username}" already exists.'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': f'Email already registered.'}, status=400)

    names = full_name.split(' ', 1)
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=names[0] if names else '',
        last_name=names[1] if len(names) > 1 else '',
        is_staff=True,
        is_superuser=False,
    )
    return Response({'message': f'Admin "{username}" created.', 'id': user.id})


@api_view(['DELETE'])
def delete_admin(request, pk):
    su = is_superuser_request(request)
    if not su:
        return Response({'error': 'Superuser access required.'}, status=403)
    try:
        user = User.objects.get(pk=pk, is_staff=True)
        if user.is_superuser:
            return Response({'error': 'Cannot delete superuser.'}, status=403)
        user.delete()
        return Response({'message': 'Admin removed.'})
    except User.DoesNotExist:
        return Response({'error': 'Admin not found.'}, status=404)


@api_view(['POST'])
def change_admin_password(request):
    su = is_superuser_request(request)
    if not su:
        return Response({'error': 'Superuser access required.'}, status=403)

    username     = request.data.get('username','').strip()
    new_password = request.data.get('new_password','')

    if not username or not new_password:
        return Response({'error': 'Username and new password required.'}, status=400)
    if len(new_password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=400)

    try:
        user = User.objects.get(username=username, is_staff=True)
        user.set_password(new_password)
        user.save()
        return Response({'message': f'Password updated for "{username}".'})
    except User.DoesNotExist:
        return Response({'error': f'Admin "{username}" not found.'}, status=404)