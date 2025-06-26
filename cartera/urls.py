from django.urls import path
from . import views

app_name = 'cartera' # Namespace para las URLs

urlpatterns = [
    # URL para la página principal que ve el usuario
    path('', views.consulta_page, name='consulta_page'),
    
    # URL para la API que maneja la búsqueda (usada por JavaScript)
    path('buscar/', views.buscar_cliente_api, name='buscar_api'),
]