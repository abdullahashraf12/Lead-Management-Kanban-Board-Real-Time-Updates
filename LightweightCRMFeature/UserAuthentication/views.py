from django.shortcuts import render
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate ,login,logout
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from django.http import JsonResponse

# Create your views here.

def login_get(request):
    return render(request,"login.html")
def register_get(request):
    return render(request,"register.html")

def check_User_Login(request):
    if request.user.is_authenticated:
        return JsonResponse({"message": "User already authenticated", "status": True})
    else:
        return JsonResponse({"message": "User NotLoggedIn", "status": False})

def login_post(request):
    # Check if the user is already authenticated
    if request.user.is_authenticated:
        return JsonResponse({"message": "User already authenticated", "status": "success"})

    if request.method == "POST":
        try:
            # Get the account (email) and password from the request
            account = request.POST.get("account")  # Email (used as the username field)
            password = request.POST.get("id_password")  # Password

            # Print received account and password for debugging (remove this in production)
            print(f"Received account: {account}")
            print(f"Received password: {password}")

            # Authenticate the user by email
            user = authenticate(request, username=account, password=password)

            # Check if the user exists and is authenticated
            if user is not None:
                login(request, user)  # Log the user in
                return JsonResponse({"message": "Login successful", "status": "success"})
            else:
                return JsonResponse({"message": "Invalid credentials", "status": "error"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON", "status": "error"}, status=400)

    return JsonResponse({"message": "Invalid request method", "status": "error"}, status=405)



def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse(
            {"message": "User is logged in. Logging out.", "status": "success"}, 
            status=200  # Use an integer HTTP status code
        )
    else:
        return JsonResponse(
            {"message": "User is not logged in. Cannot log out.", "status": "error"}, 
            status=400  # Use 400 (Bad Request) or another appropriate status code
        )


def register_post(request):
    # Check if the user is already authenticated
    if request.user.is_authenticated:
        return JsonResponse({"message": "User is already logged in. Cannot register again.", "status": "error"}, status=400)

    if request.method == "POST":
        account = request.POST.get("account")  # Email
        username = request.POST.get("id_username")  # Username
        password1 = request.POST.get("id_password1")  # Password
        password2 = request.POST.get("id_password2")  # Confirm Password

        print(f"Received account: {account}")
        print(f"Received password: {password1}")

        # Basic validation
        if not all([account, username, password1, password2]):
            return JsonResponse({"message": "All fields are required.", "status": "error"}, status=400)

        if password1 != password2:
            return JsonResponse({"message": "Passwords do not match.", "status": "error"}, status=400)

        if get_user_model().objects.filter(username=username).exists():
            return JsonResponse({"message": "Username already taken.", "status": "error"}, status=400)

        if get_user_model().objects.filter(email=account).exists():
            return JsonResponse({"message": "Email already registered.", "status": "error"}, status=400)

        # Create user (password is automatically hashed by Django's create_user method)
        user = get_user_model().objects.create_user(username=account, email=account, password=password1)
        
        # Auto-login after registration
        # login(request, user)

        # Save the user (not necessary since `create_user` automatically saves)
        user.save()

        return JsonResponse({"message": "Registration successful", "status": "success"})

    return JsonResponse({"message": "Invalid request method", "status": "error"}, status=405)

