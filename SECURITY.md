# Security policy

Please report vulnerabilities privately through the production contact channel. Do not attach confidential documents, access another person's data, or perform denial-of-service testing.

The current release processes files locally and intentionally exposes no document-upload API. Any future cloud-processing change must include a threat model, isolated workers, private storage, short-lived signed URLs, strict resource limits, automated deletion and deletion reconciliation before release.
