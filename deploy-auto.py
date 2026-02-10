import subprocess
import time
import re
import os
import sys
import signal

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def print_step(step, total, text):
    print(f"[{step}/{total}] {text}")

def update_axios_config(backend_url):
    """Actualiza la configuración de axios con la nueva URL del backend"""
    file_path = 'frontend/src/api/axios.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Actualizar baseURL
    pattern = r"baseURL:\s*['\"].*?['\"]"
    replacement = f"baseURL: '{backend_url}/api/'"
    content = re.sub(pattern, replacement, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ axios.js actualizado con: {backend_url}/api/")

def start_django():
    """Inicia el servidor Django"""
    print_step(1, 6, "Iniciando servidor Django...")
    
    os.chdir('backend')
    if os.name == 'nt':  # Windows
        process = subprocess.Popen(
            'venv\\Scripts\\activate && python manage.py runserver 0.0.0.0:8000',
            shell=True,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
    else:  # Linux/Mac
        process = subprocess.Popen(
            'source venv/bin/activate && python manage.py runserver 0.0.0.0:8000',
            shell=True
        )
    os.chdir('..')
    
    time.sleep(5)
    print("✅ Backend iniciado en http://localhost:8000\n")
    return process

def start_cloudflare_tunnel(port, name):
    """Inicia un túnel de Cloudflare y captura la URL"""
    print(f"⏳ Creando túnel Cloudflare para {name}...")
    
    if os.name == 'nt':  # Windows
        process = subprocess.Popen(
            f'cloudflared tunnel --url http://localhost:{port}',
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NEW_CONSOLE,
            text=True,
            bufsize=1
        )
    else:  # Linux/Mac
        process = subprocess.Popen(
            f'cloudflared tunnel --url http://localhost:{port}',
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
    
    # Esperar y capturar la URL
    url = None
    timeout = 30
    start_time = time.time()
    
    print("⏳ Esperando URL del túnel...")
    
    while time.time() - start_time < timeout:
        line = process.stdout.readline()
        if line:
            # Buscar URL en el formato: https://xxxxx.trycloudflare.com
            match = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', line)
            if match:
                url = match.group(0)
                break
        time.sleep(0.5)
    
    if url:
        print(f"✅ Túnel {name} creado: {url}\n")
        return process, url
    else:
        print(f"⚠️  No se pudo capturar la URL automáticamente")
        print(f"   Verifica la ventana del túnel manualmente\n")
        return process, None

def build_frontend():
    """Construye el frontend"""
    print_step(4, 6, "Construyendo frontend...")
    
    os.chdir('frontend')
    result = subprocess.run('npm run build', shell=True)
    os.chdir('..')
    
    if result.returncode != 0:
        print("❌ ERROR: Build del frontend falló")
        sys.exit(1)
    
    print("✅ Frontend construido exitosamente\n")

def serve_frontend():
    """Sirve el frontend construido"""
    print_step(5, 6, "Iniciando servidor frontend...")
    
    if os.name == 'nt':  # Windows
        process = subprocess.Popen(
            'npx serve -s frontend/dist -l 3000',
            shell=True,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
    else:  # Linux/Mac
        process = subprocess.Popen(
            'npx serve -s frontend/dist -l 3000',
            shell=True
        )
    
    time.sleep(3)
    print("✅ Frontend sirviendo en http://localhost:3000\n")
    return process

def main():
    print_header("SISTEMA STAR - DEPLOYMENT AUTOMATIZADO")
    print("Cloudflare Tunnel + Build Automático\n")
    
    processes = []
    
    try:
        # 1. Iniciar Django
        django_process = start_django()
        processes.append(django_process)
        
        # 2. Crear túnel para backend
        print_step(2, 6, "Creando túnel Cloudflare para Backend...")
        backend_process, backend_url = start_cloudflare_tunnel(8000, "Backend")
        processes.append(backend_process)
        
        if not backend_url:
            backend_url = input("\n⚠️  Ingresa manualmente la URL del backend: ").strip()
        
        # 3. Actualizar axios
        print_step(3, 6, "Actualizando configuración de axios...")
        update_axios_config(backend_url)
        print()
        
        # 4. Build frontend
        build_frontend()
        
        # 5. Servir frontend
        frontend_server = serve_frontend()
        processes.append(frontend_server)
        
        # 6. Crear túnel para frontend
        print_step(6, 6, "Creando túnel Cloudflare para Frontend...")
        frontend_process, frontend_url = start_cloudflare_tunnel(3000, "Frontend")
        processes.append(frontend_process)
        
        # Resumen
        print_header("✅ DEPLOYMENT COMPLETO")
        print("📋 RESUMEN:")
        print("="*60)
        print(f"\n🔧 Backend Local:    http://localhost:8000")
        print(f"🌐 Backend Público:  {backend_url}")
        print(f"\n🔧 Frontend Local:   http://localhost:3000")
        if frontend_url:
            print(f"🌐 Frontend Público: {frontend_url}")
        else:
            print(f"🌐 Frontend Público: [Verifica la ventana del túnel]")
        
        print("\n" + "="*60)
        
        # DESTACAR URL DEL CLIENTE
        print("\n" + "#"*60)
        print("#" + " "*58 + "#")
        print("#  📱 URL PARA COMPARTIR CON EL CLIENTE:" + " "*18 + "#")
        print("#" + " "*58 + "#")
        if frontend_url:
            print(f"#  {frontend_url}" + " "*(58-len(frontend_url)) + "#")
            # Copiar al portapapeles
            try:
                import pyperclip
                pyperclip.copy(frontend_url)
                print("#" + " "*58 + "#")
                print("#  ✅ URL copiada al portapapeles" + " "*24 + "#")
            except:
                pass
        else:
            print("#  ⚠️  Verifica la ventana 'Cloudflare Frontend'" + " "*10 + "#")
        print("#" + " "*58 + "#")
        print("#"*60)
        
        print("\n" + "="*60)
        print("\n📝 INSTRUCCIONES:")
        print("   1. Comparte la URL destacada arriba con tu cliente")
        print("   2. El cliente puede acceder desde cualquier dispositivo")
        print("   3. El sistema está listo para usar")
        print("\n⚠️  IMPORTANTE:")
        print("   - NO cierres este script")
        print("   - Las URLs cambian cada vez que reinicias")
        print("   - Presiona Ctrl+C para detener todos los servicios")
        print("\n" + "="*60)
        
        # Guardar URLs en archivo
        with open('DEPLOYMENT_URLS.txt', 'w', encoding='utf-8') as f:
            f.write("SISTEMA STAR - URLs de Deployment\n")
            f.write("="*60 + "\n\n")
            f.write(f"Backend Público:  {backend_url}\n")
            if frontend_url:
                f.write(f"Frontend Público: {frontend_url}\n")
            f.write(f"\nFecha: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        print("\n💾 URLs guardadas en: DEPLOYMENT_URLS.txt")
        
        # Mantener el script corriendo
        print("\n⏳ Servicios corriendo... Presiona Ctrl+C para detener\n")
        
        while True:
            time.sleep(60)
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Deteniendo servicios...")
        for process in processes:
            try:
                if os.name == 'nt':
                    process.terminate()
                else:
                    os.kill(process.pid, signal.SIGTERM)
            except:
                pass
        print("✅ Todos los servicios detenidos")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        for process in processes:
            try:
                process.terminate()
            except:
                pass
        sys.exit(1)

if __name__ == "__main__":
    main()
