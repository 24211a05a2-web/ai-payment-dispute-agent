from app.rag.vector_store import chroma_collection, local_policy_store

def retrieve_relevant_policy(query: str, category: str = "") -> str:
    """
    Retrieves the most relevant policy excerpt using RAG (ChromaDB or Local Vector Store).
    """
    combined_query = f"{category} {query}".strip()

    try:
        if chroma_collection is not None:
            results = chroma_collection.query(
                query_texts=[combined_query],
                n_results=2
            )
            if results and results.get("documents") and len(results["documents"][0]) > 0:
                policy_text = "\n\n---\n\n".join(results["documents"][0])
                return policy_text
    except Exception as e:
        print(f"ChromaDB retrieval exception: {e}")

    # Fallback to local store
    results = local_policy_store.search(combined_query, limit=2)
    if results:
        policy_snippets = [f"[{res['source']}]\n{res['content']}" for res in results]
        return "\n\n---\n\n".join(policy_snippets)

    return "Standard Dispute Policy: Payment disputes are evaluated based on transaction status, gateway confirmation, and order fulfillment status."
