# odk-viewer-alpha

This project is a TypeScript-based website, built with [Vercel v0](https://v0.app/).  
It runs on JSON files and is deployed via [Vercel](https://vercel.com/).

Below is an example JSON file (public/data/model1/xx.json).  
Please follow this format when creating your own files.

```
[
    {
        "scene_id": "scene_0000",
        "start_time": "00:00:00",
        "end_time": "00:00:01",
        "odk_id": "None",
        "labels": {
            "emotions": ["playful"],
            "themes": ["introduction"],
            "actions": ["appearing"],
            "objects": ["shrimp", "crown"],
            "characters": ["animated shrimp"],
            "weather": [],
            "brands": []
        },
        "locations": ["abstract background"],
        "genre": "animation",
        "iab_categories": [
            "IAB19-2: (Animation)",
            "IAB1-4: (Humor)",
            "IAB1: (Arts & Entertainment)",
            "IAB1-7: (Television)",
            "IAB19-29: (Entertainment)"
        ],
        "language": "ko-KR",
        "keywords": ["shrimp", "cartoon", "mascot", "intro"],
        "ad_marker_type": "SCTE-35",
        "ad_marker_position": "start",
        "confidence_score": 0.88,
        "description": "An animated red shrimp character with a crown appears against a black, grainy background."
    },
]

```





**For inquiries**: ``AILab_안성현 (sunghyun.ahn@pyler.tech)``
