import os
import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Vendor, Invoice, User
from .serializers import VendorSerializer, InvoiceSerializer, UserSerializer
from .permissions import IsAdminOrReadOnly
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def create(self, request, *args, **kwargs):
        try:
            file = request.FILES.get('file')
            if file:
                file_url = self.upload_to_supabase(file)
                if file_url:
                    request.data._mutable = True
                    request.data['file_url'] = file_url
                else:
                    return Response({'error': 'File upload failed'}, status=500)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=False)

            if serializer.errors:
                print("Serializer validation errors:", serializer.errors)
                return Response(serializer.errors, status=400)

            serializer.save()
            return Response(serializer.data, status=201)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


    def upload_to_supabase(self, file):
        filename = file.name
        url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{filename}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/octet-stream",
        }
        response = requests.post(url, headers=headers, data=file.read())
        print("Upload status:", response.status_code)
        print("Upload body:", response.text)
        if response.ok:
            return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{filename}"
        return None

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = "Paid"
        invoice.save()
        return Response({'status': 'Marked as paid'})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User.objects.create(
            username=data['username'],
            password=make_password(data['password']),
            email=data.get('email', ''),
            role='viewer'
        )
        return Response({'message': 'User registered successfully'}, status=201)