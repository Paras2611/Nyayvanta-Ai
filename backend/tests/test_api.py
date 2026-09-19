import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Nyayavanta" in data["service"]
    assert "consumer" in data["supported_domains"]

def test_auth_register_and_login(client):
    email = "advocate.sharma@nyayavanta.in"
    reg_resp = client.post("/api/auth/register", json={
        "email": email,
        "password": "SecurePassword123",
        "full_name": "Advocate R. Sharma",
        "role": "advocate"
    })
    # Either 200 (first run) or 400 (already registered in persistent DB)
    assert reg_resp.status_code in [200, 400]

    login_resp = client.post("/api/auth/login", json={
        "email": email,
        "password": "SecurePassword123"
    })
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["user"]["email"] == email

def test_laws_and_cases_endpoints(client):
    laws_resp = client.get("/api/laws")
    assert laws_resp.status_code == 200
    laws = laws_resp.json()
    assert len(laws) >= 4
    act_names = [l["actName"] for l in laws]
    assert any("Consumer Protection Act" in a for a in act_names)
    assert any("Transfer of Property Act" in a for a in act_names)

    cases_resp = client.get("/api/cases")
    assert cases_resp.status_code == 200
    cases = cases_resp.json()
    assert len(cases) >= 2
    case_names = [c["caseName"] for c in cases]
    assert any("Kailash Nath" in c for c in case_names)

def test_hybrid_search(client):
    search_resp = client.post("/api/search", json={
        "query": "Section 108 security deposit refund lease",
        "tab": "All"
    })
    assert search_resp.status_code == 200
    res_data = search_resp.json()
    assert res_data["totalResults"] > 0
    assert len(res_data["results"]) > 0

def test_chat_clarification_flow(client):
    # Query with missing details should prompt clarification questions
    chat_resp = client.post("/api/chat", json={
        "query": "Seller sent broken refrigerator and is not answering calls",
        "domainId": "consumer"
    })
    assert chat_resp.status_code == 200
    chat_data = chat_resp.json()
    assert chat_data["domainId"] == "consumer"
    assert chat_data["isClarification"] is True
    assert chat_data["clarification"] is not None
    assert len(chat_data["clarification"]["questions"]) > 0

def test_chat_evidence_backed_response(client):
    # Query with full clarification answered
    chat_resp = client.post("/api/chat", json={
        "query": "Landlord withholding deposit of Rs 80,000 after I vacated Bengaluru flat in October 2025 with 15 days notice",
        "domainId": "tenancy",
        "clarificationAnswers": {
            "q_tenancy_deed": "Unregistered Written Agreement",
            "q_notice": "yes"
        }
    })
    assert chat_resp.status_code == 200
    resp_data = chat_resp.json()
    assert resp_data["domainId"] == "tenancy"
    assert resp_data["isClarification"] is False
    assert len(resp_data["answer"]) > 50
    assert len(resp_data["whyThisMayApply"]) > 10
    assert len(resp_data["relevantLaw"]) > 0
    assert len(resp_data["relevantCases"]) > 0
    assert len(resp_data["verification"]) > 0
    assert resp_data["confidence"]["score"] >= 70.0

def test_document_intelligence(client):
    doc_resp = client.post("/api/documents/analyze", json={
        "filename": "Lease_Agreement_2025.pdf",
        "document_text": "Clause 4: The tenant paid a deposit of INR 1,00,000.\nClause 8: In case of breach, the entire security deposit shall be forfeited as liquidated damages.\nClause 14: Post-employment non-compete for 2 years within 50km is strictly enforced."
    })
    assert doc_resp.status_code == 200
    data = doc_resp.json()
    assert data["riskLevel"] in ["HIGH", "CRITICAL"]
    assert len(data["importantClauses"]) >= 2
    clause_titles = [c["clauseTitle"] for c in data["importantClauses"]]
    assert any("Liquidated Damages" in t for t in clause_titles)
    assert any("Non-Compete" in t for t in clause_titles)
