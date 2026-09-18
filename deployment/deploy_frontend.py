import ftplib
import os

host = 'ftp.dataholics.com.mx'
user = 'DEV_BB@border-built.com'
password = '?Vaf.;R2,F@B'

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

if not os.path.exists(dist_dir):
    raise SystemExit(f"Build output not found at {dist_dir}. Run 'npm run build' first.")

ftp = ftplib.FTP(host)
ftp.login(user, password)
print("FTP logged in successfully.")

try:
    ftp.mkd('assets')
except Exception:
    pass

assets_dir = os.path.join(dist_dir, 'assets')
if os.path.exists(assets_dir):
    for item in os.listdir(assets_dir):
        local_path = os.path.join(assets_dir, item)
        if os.path.isfile(local_path):
            remote_path = f'assets/{item}'
            with open(local_path, 'rb') as f:
                ftp.storbinary(f'STOR {remote_path}', f)
                print(f"Uploaded {item} -> {remote_path}")

index_path = os.path.join(dist_dir, 'index.html')
if os.path.exists(index_path):
    with open(index_path, 'rb') as f:
        ftp.storbinary('STOR index.html', f)
        print("Uploaded index.html")

ftp.quit()
print("Frontend deployment completed!")
