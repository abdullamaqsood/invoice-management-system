from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('viewer', 'Viewer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='viewer')

class Vendor(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return self.name

class Invoice(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Paid", "Paid"),
        ("Overdue", "Overdue"),
    ]
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=100)
    amount = models.FloatField()
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(choices=STATUS_CHOICES, max_length=10)
    file_url = models.URLField()

    def __str__(self):
        return f"Invoice {self.invoice_number} for {self.vendor.name}"
