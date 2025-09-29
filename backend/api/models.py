from fastapi import APIRouter
import json
import os

router = APIRouter()

MODELS_JSON_PATH = os.path.join(os.path.dirname(__file__), '../models.json')

@router.get('/api/models')
def get_models():
    with open(MODELS_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    models = [
        {
            'id': m['id'],
            'name': m.get('name', m['id']),
            'description': m.get('description', '')
        }
        for m in data.get('models', [])
    ]
    return {'models': models}
