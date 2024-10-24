# proper-noun-correction

## Running the Project Locally

### Create a Virtual Environment

```
cd backend
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

### .env

Rename the .env.example file to .env and add your OpenAI API key.

### Start backend server

`uvicorn main:app --reload`

### Or docker

```
docker build -t backend-image .
docker run -p 8000:8000 --env-file .env backend-image
```

### frontend

```
cd ../frontend
npm install
npm start
```

### packaging as chrome extension

```
npm run build
```

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" by toggling the switch in the upper-right corner.
3. Click "Load unpacked" and select the `build` directory.
