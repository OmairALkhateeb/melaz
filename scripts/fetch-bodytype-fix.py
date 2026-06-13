import json, os, urllib.parse, urllib.request

OUT = os.path.join("public", "body-types")
UA = "melaz-motors-dev/1.0 (https://almelazmotors.com; contact@almelazmotors.com)"

QUERIES = {
    "van":         ["Volkswagen Caravelle T6", "Toyota Proace Verso",
                    "Ford Tourneo Custom", "Volkswagen Multivan T6.1",
                    "Mercedes-Benz V-Class W447"],
}

BAD = ("interior", "engine", "dashboard", "logo", "diagram", "drawing", "rear",
       "wheel", "badge", "emblem", "gauge", "seat", "trunk", "boot", "crash",
       "assembly", "production", "chassis", "cutaway", "blueprint", "sketch",
       "fire", "ambulance", "police", "taxi", "rescue", "emergency", "military",
       "hearse", "cross", "army", "racing", "rally", "wreck", "back",
       "feuerwehr", "rettung", "polizei", "krankenwagen", "notarzt", "thw",
       "camper", "conversion", "motorhome")

def api_search(query):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": "6", "gsrsearch": query, "gsrlimit": "15",
        "prop": "imageinfo", "iiprop": "url|mime|size", "iiurlwidth": "1000",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    pages = list(data.get("query", {}).get("pages", {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    out = []
    for p in pages:
        title = p.get("title", "").lower()
        ii = (p.get("imageinfo") or [{}])[0]
        if ii.get("mime") != "image/jpeg":
            continue
        if any(b in title for b in BAD):
            continue
        w = ii.get("thumbwidth", 0) or 0
        h = ii.get("thumbheight", 0) or 0
        if w < 600 or h < 380 or (h and w / h < 1.25):
            continue
        out.append(ii.get("thumburl"))
    return out

def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if len(data) < 8000:
        return False
    with open(dest, "wb") as f:
        f.write(data)
    return True

for t, queries in QUERIES.items():
    saved = False
    for q in queries:
        try:
            urls = api_search(q)
        except Exception as e:
            print(f"  [{t}] '{q}' error: {e}")
            continue
        for u in urls:
            try:
                if download(u, os.path.join(OUT, f"{t}.jpg")):
                    print(f"{t}: OK -> {q}")
                    saved = True
                    break
            except Exception:
                pass
        if saved:
            break
    if not saved:
        print(f"{t}: FAILED")
