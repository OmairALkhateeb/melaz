import json, os, sys, urllib.parse, urllib.request

OUT = os.path.join("public", "body-types")
os.makedirs(OUT, exist_ok=True)

UA = "melaz-motors-dev/1.0 (https://almelazmotors.com; contact@almelazmotors.com)"

# Representative, well-photographed models per body type.
QUERIES = {
    "sedan":       ["Toyota Camry XV70", "Honda Accord 2018", "BMW 5 Series G30"],
    "suv":         ["Toyota Land Cruiser 300", "Range Rover 2022", "BMW X5 G05"],
    "crossover":   ["Toyota RAV4 2019", "Hyundai Tucson 2021", "Mazda CX-5"],
    "hatchback":   ["Volkswagen Golf Mk8", "Toyota Yaris 2020 hatchback", "Mazda 2 2020"],
    "coupe":       ["Ford Mustang 2018", "Audi A5 coupe", "BMW 4 Series coupe"],
    "convertible": ["Mazda MX-5 ND", "BMW 4 Series convertible", "Ford Mustang convertible"],
    "wagon":       ["Volvo V60 2019", "Audi A4 Avant B9", "Mercedes-Benz E-Class estate"],
    "pickup":      ["Toyota Hilux 2020", "Ford F-150 2018", "Toyota Tacoma 2020"],
    "van":         ["Toyota Hiace 2019", "Mercedes-Benz Vito", "Volkswagen Transporter T6"],
}

BAD = ("interior", "engine", "dashboard", "logo", "diagram", "drawing", "rear",
       "wheel", "badge", "emblem", "gauge", "seat", "trunk", "boot", "crash",
       "assembly", "production", "chassis", "cutaway", "blueprint", "sketch")

def api_search(query):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": "6", "gsrsearch": query, "gsrlimit": "12",
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
        if w < 600 or h < 380:
            continue
        # prefer landscape
        if h and w / h < 1.2:
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

results = {}
for t, queries in QUERIES.items():
    saved = False
    for q in queries:
        try:
            urls = api_search(q)
        except Exception as e:
            print(f"  [{t}] query '{q}' error: {e}")
            continue
        for u in urls:
            try:
                if download(u, os.path.join(OUT, f"{t}.jpg")):
                    results[t] = (q, u)
                    saved = True
                    break
            except Exception as e:
                print(f"  [{t}] dl error: {e}")
        if saved:
            break
    print(f"{t}: {'OK -> '+results[t][0] if saved else 'FAILED'}")

print("\nDownloaded:", len(results), "/", len(QUERIES))
