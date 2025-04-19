import sys
import os

# No longer need to modify sys.path when running pytest from service root

def test_import_main():
    """Tests if the main FastAPI app can be imported."""
    try:
        # Import directly from main now
        from main import app
        assert app is not None
    except ImportError as e:
        assert False, f"Failed to import main: {e}"
    except Exception as e:
        assert False, f"An error occurred during import: {e}"

def test_health_endpoint_exists():
    """Tests if the /health endpoint exists on the app."""
    # Import directly from main now
    from main import app
    # Find the route for /health
    health_route = None
    for route in app.routes:
        if hasattr(route, 'path') and route.path == '/health':
            health_route = route
            break
    assert health_route is not None, "/health route not found"
    assert 'GET' in getattr(health_route, 'methods', []), "GET method not supported for /health" 