# Tasks Module

Base path: `/api/tasks`

Conventions:
- headers: `Content-Type: application/json`
- auth: all routes require `Authorization: Bearer <accessToken>`
- success shape: `{ data, meta? }`
- errors: `{ error: { message, code? }, meta? }`

## Create Today Plan
- POST `/api/tasks/plans`

Request
```
POST /api/tasks/plans
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "summary": "focus: wrap up onboarding flow",
  "tasks": [
    {
      "title": "polish onboarding emails",
      "description": "update copy based on feedback",
      "status": "IN_PROGRESS",
      "order": 0,
      "attachments": [
        {
          "url": "https://example.com/docs/email-spec",
          "label": "email copy",
          "description": "review before sending to marketing"
        }
      ]
    },
    {
      "title": "prepare sprint demo",
      "status": "PLANNED",
      "order": 1,
      "attachments": []
    }
  ]
}
```

Response 201
```
{
  "data": {
    "id": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
    "userId": "b44f2e9f-53d1-4137-87c5-a44a85c6a8dc",
    "workDate": "2025-10-21T00:00:00.000Z",
    "summary": "focus: wrap up onboarding flow",
    "createdAt": "2025-10-21T08:19:45.512Z",
    "updatedAt": "2025-10-21T08:19:45.512Z",
    "tasks": [
      {
        "id": "884f77c2-0b2b-48ac-8a40-513790b1fbab",
        "taskPlanId": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
        "title": "polish onboarding emails",
        "description": "update copy based on feedback",
        "status": "IN_PROGRESS",
        "order": 0,
        "completedAt": null,
        "createdAt": "2025-10-21T08:19:45.512Z",
        "updatedAt": "2025-10-21T08:19:45.512Z",
        "attachments": [
          {
            "id": "1d2f76c2-5af4-47b3-8c24-640bb12dd01c",
            "taskEntryId": "884f77c2-0b2b-48ac-8a40-513790b1fbab",
            "label": "email copy",
            "url": "https://example.com/docs/email-spec",
            "description": "review before sending to marketing",
            "createdAt": "2025-10-21T08:19:45.512Z",
            "updatedAt": "2025-10-21T08:19:45.512Z"
          }
        ]
      },
      {
        "id": "4255fee3-932c-4ff5-baa0-50f36f72f7db",
        "taskPlanId": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
        "title": "prepare sprint demo",
        "description": null,
        "status": "PLANNED",
        "order": 1,
        "completedAt": null,
        "createdAt": "2025-10-21T08:19:45.512Z",
        "updatedAt": "2025-10-21T08:19:45.512Z",
        "attachments": []
      }
    ]
  }
}
```

Conflict (plan already exists)
```
HTTP/1.1 409 Conflict
{
  "error": { "message": "plan already exists for today", "code": "PLAN_EXISTS" }
}
```

Validation error (non-https attachment link)
```
HTTP/1.1 422 Unprocessable Entity
{
  "error": { "message": "attachment url must use https", "code": "VALIDATION_ERROR" }
}
```

## Update Today Plan
- PATCH `/api/tasks/plans/:planId`

Only plans for the current UTC day can be updated. Past-day plans return `409 PLAN_LOCKED`.

Request
```
PATCH /api/tasks/plans/7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "summary": "focus: finalize onboarding + demo recording",
  "tasks": [
    {
      "title": "polish onboarding emails",
      "description": "sent to marketing for review",
      "status": "DONE",
      "order": 0,
      "attachments": [
        {
          "url": "https://example.com/docs/email-spec",
          "label": "email copy"
        }
      ]
    },
    {
      "title": "record sprint demo",
      "status": "IN_PROGRESS",
      "order": 1,
      "attachments": [
        {
          "url": "https://example.com/videos/script",
          "label": "demo script"
        }
      ]
    }
  ]
}
```

Response 200
```
{
  "data": {
    "id": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
    "userId": "b44f2e9f-53d1-4137-87c5-a44a85c6a8dc",
    "workDate": "2025-10-21T00:00:00.000Z",
    "summary": "focus: finalize onboarding + demo recording",
    "createdAt": "2025-10-21T08:19:45.512Z",
    "updatedAt": "2025-10-21T09:02:31.714Z",
    "tasks": [
      {
        "id": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
        "taskPlanId": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
        "title": "polish onboarding emails",
        "description": "sent to marketing for review",
        "status": "DONE",
        "order": 0,
        "completedAt": null,
        "createdAt": "2025-10-21T09:02:31.714Z",
        "updatedAt": "2025-10-21T09:02:31.714Z",
        "attachments": [
          {
            "id": "f41c6b7b-2424-4b91-b0ff-12b38616457a",
            "taskEntryId": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
            "label": "email copy",
            "url": "https://example.com/docs/email-spec",
            "description": null,
            "createdAt": "2025-10-21T09:02:31.714Z",
            "updatedAt": "2025-10-21T09:02:31.714Z"
          }
        ]
      },
      {
        "id": "73693034-2f91-4e54-9ee1-e9ad7aa07836",
        "taskPlanId": "7d27a69d-6d93-4efb-8ab9-4c915aa9d2ac",
        "title": "record sprint demo",
        "description": null,
        "status": "IN_PROGRESS",
        "order": 1,
        "completedAt": null,
        "createdAt": "2025-10-21T09:02:31.714Z",
        "updatedAt": "2025-10-21T09:02:31.714Z",
        "attachments": [
          {
            "id": "b20f876a-ef86-4b8d-89a4-98f9234546da",
            "taskEntryId": "73693034-2f91-4e54-9ee1-e9ad7aa07836",
            "label": "demo script",
            "url": "https://example.com/videos/script",
            "description": null,
            "createdAt": "2025-10-21T09:02:31.714Z",
            "updatedAt": "2025-10-21T09:02:31.714Z"
          }
        ]
      }
    ]
  }
}
```

Locked plan (not today)
```
HTTP/1.1 409 Conflict
{
  "error": { "message": "plan can no longer be updated", "code": "PLAN_LOCKED" }
}
```

Plan not found or not owned by user
```
HTTP/1.1 404 Not Found
{
  "error": { "message": "Task plan not found", "code": "PLAN_NOT_FOUND" }
}
```

## Get Today Plan
- GET `/api/tasks/plans/today`

Response 200
```
{
  "data": {
    "id": "bdcaa566-6ab9-40d8-95d7-791ebb0fa4ba",
    "userId": "b44f2e9f-53d1-4137-87c5-a44a85c6a8dc",
    "workDate": "2025-10-21T00:00:00.000Z",
    "summary": "focus: finalize onboarding + demo recording",
    "createdAt": "2025-10-21T08:19:45.512Z",
    "updatedAt": "2025-10-21T09:02:31.714Z",
    "tasks": [
      {
        "id": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
        "taskPlanId": "bdcaa566-6ab9-40d8-95d7-791ebb0fa4ba",
        "title": "polish onboarding emails",
        "description": "sent to marketing for review",
        "status": "DONE",
        "order": 0,
        "completedAt": null,
        "createdAt": "2025-10-21T09:02:31.714Z",
        "updatedAt": "2025-10-21T09:02:31.714Z",
        "attachments": [
          {
            "id": "f41c6b7b-2424-4b91-b0ff-12b38616457a",
            "taskEntryId": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
            "label": "email copy",
            "url": "https://example.com/docs/email-spec",
            "description": null,
            "createdAt": "2025-10-21T09:02:31.714Z",
            "updatedAt": "2025-10-21T09:02:31.714Z"
          }
        ]
      }
    ]
  }
}
```

Not Found (no plan created yet)
```
HTTP/1.1 404 Not Found
{
  "error": { "message": "Task plan not found", "code": "PLAN_NOT_FOUND" }
}
```

## List History
- GET `/api/tasks/history?from=<ISO>&to=<ISO>&page=<number>&pageSize=<number>`

Query parameters:
- `from` (optional): ISO 8601 date/time; inclusive lower bound.
- `to` (optional): ISO 8601 date/time; inclusive upper bound.
- `page` (optional, default 1): starting from 1.
- `pageSize` (optional, default 10, max 50).

Request
```
GET /api/tasks/history?from=2025-10-18T00:00:00.000Z&to=2025-10-21T23:59:59.999Z&page=1&pageSize=10
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": [
    {
      "id": "bdcaa566-6ab9-40d8-95d7-791ebb0fa4ba",
      "userId": "b44f2e9f-53d1-4137-87c5-a44a85c6a8dc",
      "workDate": "2025-10-21T00:00:00.000Z",
      "summary": "focus: finalize onboarding + demo recording",
      "createdAt": "2025-10-21T08:19:45.512Z",
      "updatedAt": "2025-10-21T09:02:31.714Z",
      "tasks": [
        {
          "id": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
          "taskPlanId": "bdcaa566-6ab9-40d8-95d7-791ebb0fa4ba",
          "title": "polish onboarding emails",
          "description": "sent to marketing for review",
          "status": "DONE",
          "order": 0,
          "completedAt": null,
          "createdAt": "2025-10-21T09:02:31.714Z",
          "updatedAt": "2025-10-21T09:02:31.714Z",
          "attachments": [
            {
              "id": "f41c6b7b-2424-4b91-b0ff-12b38616457a",
              "taskEntryId": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
              "label": "email copy",
              "url": "https://example.com/docs/email-spec",
              "description": null,
              "createdAt": "2025-10-21T09:02:31.714Z",
              "updatedAt": "2025-10-21T09:02:31.714Z"
            }
          ]
        }
      ]
    },
    {
      "id": "73693034-2f91-4e54-9ee1-e9ad7aa07836",
      "userId": "b44f2e9f-53d1-4137-87c5-a44a85c6a8dc",
      "workDate": "2025-10-20T00:00:00.000Z",
      "summary": null,
      "createdAt": "2025-10-20T08:10:05.143Z",
      "updatedAt": "2025-10-20T09:12:44.112Z",
      "tasks": [
        {
          "id": "1d2f76c2-5af4-47b3-8c24-640bb12dd01c",
          "taskPlanId": "73693034-2f91-4e54-9ee1-e9ad7aa07836",
          "title": "mid-task",
          "description": null,
          "status": "PLANNED",
          "order": 0,
          "completedAt": null,
          "createdAt": "2025-10-20T08:10:05.143Z",
          "updatedAt": "2025-10-20T08:10:05.143Z",
          "attachments": [
            {
              "id": "bd2b4676-7d49-4ca5-9320-9aefa09062f0",
              "taskEntryId": "1d2f76c2-5af4-47b3-8c24-640bb12dd01c",
              "label": "source",
              "url": "https://example.com/mid-task",
              "description": null,
              "createdAt": "2025-10-20T08:10:05.143Z",
              "updatedAt": "2025-10-20T08:10:05.143Z"
            }
          ]
        }
      ]
    }
  ],
  "meta": { "total": 2, "page": 1, "pageSize": 10 }
}
```

Validation error (`from` > `to`)
```
HTTP/1.1 422 Unprocessable Entity
{
  "error": { "message": "from must be before to", "code": "VALIDATION_ERROR" }
}
```

## Update Task Entry
- PATCH `/api/tasks/entries/:entryId`

Only entries that belong to the current day’s plan can be updated. Omitted fields keep their previous values. Attachments replace the entire list when provided (use `[]` or `null` to clear).

Request
```
PATCH /api/tasks/entries/cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "polish onboarding emails",
  "description": "sent to marketing for review",
  "status": "DONE",
  "order": 3,
  "attachments": [
    {
      "url": "https://example.com/docs/email-spec",
      "label": "email copy"
    },
    {
      "url": "https://example.com/tickets/123",
      "label": "tracking ticket",
      "description": "linked for QA review"
    }
  ]
}
```

Response 200
```
{
  "data": {
    "id": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
    "taskPlanId": "bdcaa566-6ab9-40d8-95d7-791ebb0fa4ba",
    "title": "polish onboarding emails",
    "description": "sent to marketing for review",
    "status": "DONE",
    "order": 3,
    "completedAt": null,
    "createdAt": "2025-10-21T09:02:31.714Z",
    "updatedAt": "2025-10-21T10:11:42.123Z",
    "attachments": [
      {
        "id": "b20f876a-ef86-4b8d-89a4-98f9234546da",
        "taskEntryId": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
        "label": "email copy",
        "url": "https://example.com/docs/email-spec",
        "description": null,
        "createdAt": "2025-10-21T10:11:42.123Z",
        "updatedAt": "2025-10-21T10:11:42.123Z"
      },
      {
        "id": "6ef1b503-f1ae-4cbb-808a-e5f022e567c9",
        "taskEntryId": "cdc8a7c5-2ac8-4cda-96ec-45f12c5c6cbd",
        "label": "tracking ticket",
        "url": "https://example.com/tickets/123",
        "description": "linked for QA review",
        "createdAt": "2025-10-21T10:11:42.123Z",
        "updatedAt": "2025-10-21T10:11:42.123Z"
      }
    ]
  }
}
```

Locked plan (entry belongs to earlier day)
```
HTTP/1.1 409 Conflict
{
  "error": { "message": "plan can no longer be updated", "code": "PLAN_LOCKED" }
}
```

Entry not found or not owned by user
```
HTTP/1.1 404 Not Found
{
  "error": { "message": "Task entry not found", "code": "ENTRY_NOT_FOUND" }
}
```

Validation error (non-https attachment)
```
HTTP/1.1 422 Unprocessable Entity
{
  "error": { "message": "attachment url must use https", "code": "VALIDATION_ERROR" }
}
```

## Notes
- `workDate` uses start-of-day UTC (00:00:00.000Z). The same user can only create one plan per UTC date.
- Task status must be one of `PLANNED`, `IN_PROGRESS`, or `DONE`. Case-insensitive input is accepted, but responses always return uppercase.
- Attachments support up to 5 links per task. URLs must be HTTPS and unique per task (duplicates are ignored).
- Summary, titles, and descriptions are trimmed; blank strings are treated as `null`.
