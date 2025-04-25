#!/usr/bin/env fish

function load_env_file
    set -l env_file $argv[1]
    for line in (cat $env_file)
        if string match -qr '^\s*#' -- $line
            continue
        end
        if string match -qr '=' -- $line
            set -l key (string split -m1 '=' $line)[1]
            set -l value (string split -m1 '=' $line)[2]
            set -gx $key $value
        end
    end
end

# config
set project_id swagstudio
set region asia-southeast1

echo ""
echo "📦 loading backend/.env..."
load_env_file backend/.env

if not set -q GOOGLE_API_KEY
    echo "❌ ERROR: GOOGLE_API_KEY not found in backend/.env"
    exit 1
end

echo ""
echo "🚀 building and deploying backend..."
gcloud builds submit ./backend --tag gcr.io/$project_id/backend-app

gcloud run deploy backend-service \
  --image gcr.io/$project_id/backend-app \
  --port 3001 \
  --set-env-vars GOOGLE_API_KEY=$GOOGLE_API_KEY,FRONTEND_URL=$FRONTEND_URL \
  --region $region \
  --allow-unauthenticated

echo ""
echo "📦 loading frontend/.env..."
if test -f frontend/.env
    load_env_file frontend/.env
end

if not set -q VITE_API_BASE_URL
    echo "❌ ERROR: VITE_API_BASE_URL not found in frontend/.env"
    exit 1
end

echo ""
echo "🚀 building and deploying frontend..."
gcloud builds submit ./frontend \
  --substitutions _VITE_API_BASE_URL=$VITE_API_BASE_URL \
  --config=frontend/cloudbuild.yaml

gcloud run deploy frontend-service \
  --image gcr.io/$project_id/frontend-app \
  --port 80 \
  --region $region \
  --allow-unauthenticated

echo ""
echo "✅ all services deployed to Cloud Run"

set backend_url (gcloud run services describe backend-service --region $region --format 'value(status.url)')
set frontend_url (gcloud run services describe frontend-service --region $region --format 'value(status.url)')

echo ""
echo "🔗 Backend URL: $backend_url"
echo "🔗 Frontend URL: $frontend_url"