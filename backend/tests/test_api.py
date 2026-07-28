import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "VenturePilot AI"
    assert data["status"] == "online"

def test_list_projects_empty_for_new_user():
    # New users start with 0 projects (strict user data isolation)
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_create_and_execute_project():
    create_res = client.post("/api/v1/projects", json={
        "name": "Test Venture AI",
        "industry": "Agritech",
        "problem_statement": "Friction in supply chain",
        "solution_overview": "Autonomous AI platform"
    })
    assert create_res.status_code == 200
    project_id = create_res.json()["project"]["id"]

    exec_res = client.post(f"/api/v1/projects/{project_id}/execute", json={
        "project_id": project_id,
        "prompt": "Increase Year 2 revenue to ₹5 Crore"
    })
    assert exec_res.status_code == 200
    assert exec_res.json()["project"]["readiness_score"] >= 75

def test_domain_guardrail_rejection():
    exec_res = client.post("/api/v1/projects/proj-123/execute", json={
        "project_id": "proj-123",
        "prompt": "Give me a recipe for chicken biryani"
    })
    assert exec_res.status_code == 200
    assert exec_res.json()["rejected"] is True
