import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import XSubirData

# Obtenemos el logger que configuramos en settings.py
logger = logging.getLogger(__name__)

def consulta_page(request):
    """
    Esta vista solo se encarga de mostrar la página HTML principal.
    """
    logger.info("Página de consulta cargada.")
    return render(request, 'consulta.html', {'title': 'Energy - Consulta Clientes'})


@require_POST # Asegura que esta vista solo acepta peticiones POST
def buscar_cliente_api(request):
    """
    Esta es la API que busca al cliente y devuelve los datos en formato JSON.
    """
    cliente_id = request.POST.get('cliente_id', '').strip()
    usuario = request.POST.get('usuario', 'N/A').strip()

    if not cliente_id:
        return JsonResponse({'status': 'error', 'message': 'La Cédula del cliente es requerida.'}, status=400)

    logger.info(f"Búsqueda iniciada por '{usuario}' para Cédula: '{cliente_id}'")

    try:
        # Usamos .filter() porque puede haber múltiples registros con la misma cédula
        resultados = XSubirData.objects.filter(Cedula=cliente_id)

        if resultados.exists():
            logger.info(f"Se encontraron {resultados.count()} registros para la cédula {cliente_id}.")
            
            # Convertimos los resultados del ORM a una lista de diccionarios para JSON
            data = [
                {
                    'cedula': r.Cedula,
                    'nombre': r.nombre,
                    'estado': r.Estado,
                    # 'monto': f"{r.monto:.2f}",
                    # 'fecha_registro': r.fecha_registro
                    # 'fecha_registro': r.fecha_registro.strftime('%Y-%m-%d')
                }
                for r in resultados
            ]
            
            return JsonResponse({'status': 'success', 'resultados': data})
        else:
            logger.warning(f"Búsqueda sin resultados para la Cédula: {cliente_id}")
            return JsonResponse({'status': 'not_found', 'message': f'Hacer Visita. No se encontraron resultados para la Cédula: {cliente_id}'})

    except Exception as e:
        logger.error(f"Error inesperado en la búsqueda de {cliente_id}: {e}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'Ocurrió un error en el servidor.'}, status=500)