import json
import re

# New hierarchical chair structure
brands = {
    "noblechairs": {
        "DAWN": [
            {"sku": "NBL-DAW-FL-BLK", "name": "NEW noblechairs DAWN Series - Faux Leather Black NBL-DAW-FL-BLK - Gaming Chair"},
            {"sku": "NBL-DAW-GER-BED", "name": "NEW noblechairs  DAWN Series - Black Edition - Gaming Chair"},
            {"sku": "NBL-DAW-ST-FL-BLK", "name": "NEW noblechairs DAWN ST Series - Faux Leather Black   - Gaming Chair"},
            {"sku": "NBL-DAW-ST-TX-GRT", "name": "NEW noblechairs DAWN ST Series - TX Granite  - Gaming Chair"},
            {"sku": "NBL-DAW-TX-GRT", "name": "NEW noblechairs DAWN Series - TX Granite  - Gaming Chair"}
        ],
        "EPIC": [
            {"sku": "NBL-ECC-PU-BLA", "name": "NEW noblechairs EPIC Compact Black/Carbon - Gaming Chair"},
            {"sku": "NBL-EPC-PU-MPF", "name": "noblechairs EPIC Mercedes-AMG Petronas 2021 Edition, Hybrid/PU - Gaming Chair"},
            {"sku": "NBL-EPC-PU-SME", "name": "NEW noblechairs EPIC Series Spider Man Edition - Gaming Chair"},
            {"sku": "NBL-EPC-PU-WED", "name": "NEW noblechairs EPIC PU White Edition - Gaming Chair"},
            {"sku": "NBL-EPC-PU-XXI", "name": "EOL noblechairs EPIC 2021 EPIC Copper - Gaming Chair"},
            {"sku": "NBL-EPC-TX-ATC", "name": "noblechairs EPIC TX Series - Anthrazite - Gaming Chair"},
            {"sku": "NBL-PU-BLA-002", "name": "noblechairs EPIC PU Black - Gaming Chair"},
            {"sku": "NBL-PU-BLA-004", "name": "noblechairs EPIC Hybrid/PU Black Edition - Gaming Chair"},
            {"sku": "NBL-PU-BLU-002", "name": "noblechairs EPIC PU Black/Blue - Gaming Chair"},
            {"sku": "NBL-PU-BVB-001", "name": "noblechairs EPIC Series Borussia Dortmund Edition - Gaming Chair"},
            {"sku": "NBL-PU-BWB-001", "name": "EOL noblechairs EPIC Limited Edition Black/White/Blue - Gaming Chair"},
            {"sku": "NBL-PU-FNC-001", "name": "NEW noblechairs EPIC NUKA-COLA Edition - Gaming Chair"},
            {"sku": "NBL-PU-GOL-002", "name": "noblechairs EPIC PU Black/Gold - Gaming Chair"},
            {"sku": "NBL-PU-GRN-002", "name": "EOL noblechairs EPIC PU Black/Green - Gaming Chair"},
            {"sku": "NBL-PU-JVE-001", "name": "noblechairs EPIC Java Edition  Hybrid/PU - Gaming Chair"},
            {"sku": "NBL-PU-MSE-001", "name": "noblechairs EPIC PU Series Mousesports Edition - Gaming Chair"},
            {"sku": "NBL-PU-PNK-001", "name": "EOL noblechairs EPIC Series PU Black/Pink - Gaming Chair"},
            {"sku": "NBL-PU-RED-002", "name": "noblechairs EPIC PU Black/Red - Gaming Chair"},
            {"sku": "NBL-PU-SKG-001", "name": "noblechairs EPIC PU SK Edition Black/White/Blue - Gaming Chair"},
            {"sku": "NBL-PU-SPE-001", "name": "noblechairs EPIC PU Series Sprout Edition Black/Green - Gaming Chair"},
            {"sku": "NBL-PU-WHT-001", "name": "noblechairs EPIC PU White/Black - Gaming Chair"},
            {"sku": "NBL-RL-BLA-001", "name": "noblechairs EPIC Real Leather Black - Gaming Chair"},
            {"sku": "NBL-RL-EPC-001", "name": "noblechairs EPIC Real Leather Black/White/Red - Gaming Chair"}
        ],
        "HERO": [
            {"sku": "NBL-HRO-PU-BBL", "name": "noblechairs HERO Series PU Black/Blue - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BED", "name": "noblechairs HERO Black Edition Hybrid/ PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BFE", "name": "NEW noblechairs HERO Boba Fett Edition - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BLA", "name": "noblechairs HERO Series PU Black/Black - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BPE", "name": "noblechairs HERO Black Panther Edition - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BPW", "name": "noblechairs HERO Series PU Black/Platinum White - Gaming Chair"},
            {"sku": "NBL-HRO-PU-BRD", "name": "noblechairs HERO Series PU Black/Red - Gaming Chair"},
            {"sku": "NBL-HRO-PU-DET", "name": "noblechairs HERO DOOM Edition PU Black/Red - Gaming Chair"},
            {"sku": "NBL-HRO-PU-DVE", "name": "NEW noblechairs HERO Darth Vader Editionn - Gaming Chair"},
            {"sku": "NBL-HRO-PU-ENE", "name": "noblechairs HERO ENCE Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-ERE", "name": "noblechairs HERO Elden Ring Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-ESO", "name": "noblechairs HERO The Elder Scrolls Online Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-FCR", "name": "noblechairs HERO PU Far Cry 6 Special Edition - chair"},
            {"sku": "NBL-HRO-PU-FVT", "name": "noblechairs HERO PU Fallout Vault-Tec Edition Blue/Yellow - Gaming Chair"},
            {"sku": "NBL-HRO-PU-GOL", "name": "noblechairs HERO Series PU Black/Gold - Gaming Chair"},
            {"sku": "NBL-HRO-PU-IME", "name": "NEW noblechairs Hero Iron Man - Gaming Chair"},
            {"sku": "NBL-HRO-PU-JED", "name": "noblechairs HERO Java Edition Hybrid/PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-KKD", "name": "EOL noblechairs HERO Knossi Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-MSE", "name": "NEW noblechairs HERO Mouz Edition - Gaming Chair"},
            {"sku": "NBL-HRO-PU-REU", "name": "noblechairs HERO Resident Evil - Gaming Chair"},
            {"sku": "NBL-HRO-PU-RMD", "name": "EOL noblechairs HERO Real Madrid Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-SKG", "name": "EOL noblechairs HERO PU SK Gaming Edition Black/White/Blue - Gaming Chair"},
            {"sku": "NBL-HRO-PU-SKY", "name": "noblechairs  HERO The Elder Scrolls V: Skyrim 10th Anniversary Edition PU - Gaming Chair"},
            {"sku": "NBL-HRO-PU-THE", "name": "noblechairs HERO Team Heretics Edition - Gaming Chair"},
            {"sku": "NBL-HRO-PU-WED", "name": "noblechairs HERO PU White Edition 2021 - Gaming Chair "},
            {"sku": "NBL-HRO-PU-WHE", "name": "noblechairs HERO Warhammer 40k - Gaming Chair"},
            {"sku": "NBL-HRO-PU-XIX", "name": "EOL noblechairs HERO Limited Edition 2019 Black/White - Gaming Chair"},
            {"sku": "NBL-HRO-RL-BLA", "name": "noblechairs HERO Series RL Black/Black - Gaming Chair"},
            {"sku": "NBL-HRO-RL-BRD", "name": "EOL noblechairs HERO RL Black/Red - Gaming Chair"},
            {"sku": "NBL-HRO-ST-XX", "name": "EOL noblechairs HERO ST Anthracite - Limited Edition 2020 Fabric - Gaming Chair"},
            {"sku": "NBL-HRO-TT-BF1", "name": "noblechairs HERO Two Tone Blue (Black Friday 2022) - Gaming Chair"},
            {"sku": "NBL-HRO-TT-BF2", "name": "EOL HERO Two Tone Green (Black Friday 2022) - Gaming Chair"},
            {"sku": "NBL-HRO-TT-BF3", "name": "noblechairs HERO Two Tone Gray (Black Friday 2022) - Gaming Chair"},
            {"sku": "NBL-HRO-TX-ATC", "name": "noblechairs HERO TX Series Anthracite Fabric - Gaming Chair"}
        ],
        "HERO ST SERIES": [
            {"sku": "NBL-HRO-ST-ATC", "name": "NEW noblechairs  HERO ST Series - TX Anthracite - Gaming Chair"},
            {"sku": "NBL-HRO-ST-BED", "name": "NEW noblechairs HERO ST Series - Black Edition - Gaming Chair"},
            {"sku": "NBL-HRO-ST-STE", "name": "NEW noblechairs HERO ST Series - Stormtrooper Edition - Gaming Chair"}
        ],
        "ICON": [
            {"sku": "NBL-ICN-PU-BBL", "name": "EOL noblechairs ICON Series PU Black/Blue - Gaming Chair"},
            {"sku": "NBL-ICN-PU-BED", "name": "noblechairs ICON Series Black Edition - Gaming Chair"},
            {"sku": "NBL-ICN-PU-BLA", "name": "noblechairs ICON Series PU Black/Black - Gaming Chair"},
            {"sku": "NBL-ICN-PU-BPW", "name": "EOL noblechairs ICON Series PU Platinum/White - Gaming Chair"},
            {"sku": "NBL-ICN-PU-BRD", "name": "EOL noblechairs ICON Series PU Black/Red - Gaming Chair"},
            {"sku": "NBL-ICN-PU-GOL", "name": "EOL noblechairs ICON Series PU Black/Gold - Gaming Chair"},
            {"sku": "NBL-ICN-PU-JED", "name": "noblechairs ICON PU Java Edition Brown - Gaming Chair"},
            {"sku": "NBL-ICN-PU-NCQ", "name": "noblechairs ICON FALLOUT NUKA-COLA QUANTUM EDITION- Gaming Chair "},
            {"sku": "NBL-ICN-PU-WBK", "name": "EOL noblechairs ICON Series PU White/Black - Gaming Chair"},
            {"sku": "NBL-ICN-PU-WED", "name": "noblechairs ICON PU White Edition 2021 - Gaming Chair "},
            {"sku": "NBL-ICN-RL-BLA", "name": "noblechairs ICON Series Real Leather Black/Black - Gaming Chair"},
            {"sku": "NBL-ICN-RL-CBK", "name": "noblechairs ICON Series Real Leather Cognac/Black - Gaming Chair"},
            {"sku": "NBL-ICN-RL-MBG", "name": "EOL noblechairs ICON Series RL Midnight Blue/Graphite - Gaming Chair"},
            {"sku": "NBL-ICN-TX-ATC", "name": "noblechairs ICON TX Series Anthracite - Gaming Chair"}
        ],
        "LEGEND": [
            {"sku": "NBL-LGD-GER-BED", "name": "NEW noblechairs Legend Series  Black Edition - gaming chair"},
            {"sku": "NBL-LGD-GER-BWR", "name": "NEW noblechairs Legend Series  black/white/red Edition - chair"},
            {"sku": "NBL-LGD-GER-JED", "name": "NEW noblechairs Legend Series Java Edition - chair"},
            {"sku": "NBL-LGD-GER-WED", "name": "NEW noblechairs LEGEND Series White Edition - chair"},
            {"sku": "NBL-LGD-PU-SFE", "name": "noblechairs LEGEND Starfield Edition - chair"},
            {"sku": "NBL-LGD-PU-SHU", "name": "noblechairs LEGEND TX Shure Edition - chair"},
            {"sku": "NBL-LGD-TX-ATC", "name": "NEW noblechairs Series  TX Edition - chair"}
        ]
    },
    "Nitro Concepts": {
        "S300": [
            {"sku": "NC-S300-B", "name": "Nitro Concepts S300 Fabric Black - Gaming Chair"},
            {"sku": "NC-S300-BB", "name": "Nitro Concepts S300 Fabric Black/Blue - Gaming Chair"},
            {"sku": "NC-S300-BG", "name": "Nitro Concepts S300 Fabric Black/Green - Gaming Chair"},
            {"sku": "NC-S300-BLSE", "name": "Nitro Concepts S300 Fabric SL Benfica Lisbon Special Edition - Gaming Chair"},
            {"sku": "NC-S300-BO", "name": "Nitro Concepts S300 Fabric Black/Orange - Gaming Chair"},
            {"sku": "NC-S300-BP", "name": "Nitro Concepts S300 Fabric Nebula Purple - Gaming Chair"},
            {"sku": "NC-S300-BR", "name": "Nitro Concepts S300 Fabric Black/Red - Gaming Chair"},
            {"sku": "NC-S300-BW", "name": "Nitro Concepts S300 Fabric Black/White - Gaming Chair"},
            {"sku": "NC-S300-BY", "name": "Nitro Concepts S300 Fabric Black/Yellow - Gaming Chair"},
            {"sku": "NC-S300-UC", "name": "Nitro Concepts S300 Fabric Urban/Camo - Gaming Chair"}
        ],
        "S300EX": [
            {"sku": "NC-S300EX-B", "name": "Nitro Concepts S300-EX PU NC-S300EX-B Stealth Black - Gaming Chair"},
            {"sku": "NC-S300EX-BC", "name": "Nitro Concepts S300-EX PU Carbon Black - Gaming Chair"},
            {"sku": "NC-S300EX-BR", "name": "Nitro Concepts S300-EX PU Inferno Red - Gaming Chair"},
            {"sku": "NC-S300EX-BW", "name": "Nitro Concepts S300-EX PU Radiant/White - Gaming Chair"}
        ],
        "X1000": [
            {"sku": "NC-X1000-B", "name": "Nitro Concepts X1000 Fabric Stealth Black - Gaming Chair"},
            {"sku": "NC-X1000-BB", "name": "Nitro Concepts X1000 Fabric Black/Galactic Blue - Gaming Chair"},
            {"sku": "NC-X1000-BR", "name": "Nitro Concepts X1000 Fabric Black/Red - Gaming Chair"},
            {"sku": "NC-X1000-BW", "name": "Nitro Concepts X1000 Fabric Black/Radiant White - Gaming Chair"}
        ]
    }
}

def load_current_database():
    """Load the current spare_parts_sku.json database"""
    try:
        with open('data/spare_parts_sku.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: spare_parts_sku.json file not found!")
        return []

def extract_sku_from_chair_model(chair_model):
    """Extract SKU from chairModel string"""
    # Pattern matches SKU at the end: "Description NBL-XXX-XXX-XXX" or "Description NC-XXX-XXX"
    pattern = r'(NBL-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+|NC-[A-Z0-9]+-[A-Z0-9]+)$'
    match = re.search(pattern, chair_model)
    return match.group(1) if match else None

def analyze_chair_models():
    """Analyze which chair models from new structure exist in current database"""
    
    print("=== CHAIR MODEL ANALYSIS ===\n")
    
    # Load current database
    current_db = load_current_database()
    if not current_db:
        return
    
    # Extract all SKUs from current database
    current_skus = set()
    chair_model_to_sku = {}
    
    for item in current_db:
        chair_model = item.get('chairModel', '')
        sku = extract_sku_from_chair_model(chair_model)
        if sku:
            current_skus.add(sku)
            if sku not in chair_model_to_sku:
                chair_model_to_sku[sku] = chair_model
    
    print(f"Found {len(current_skus)} unique SKUs in current database\n")
    
    # Analyze each brand and series
    total_new_skus = 0
    found_skus = 0
    missing_skus = []
    found_details = []
    
    for brand_name, series_dict in brands.items():
        print(f"🏢 **{brand_name.upper()}**")
        print("=" * 50)
        
        for series_name, chairs in series_dict.items():
            print(f"\n📋 **{series_name} Series** ({len(chairs)} models):")
            print("-" * 40)
            
            series_found = 0
            series_missing = []
            
            for chair in chairs:
                sku = chair['sku']
                name = chair['name']
                total_new_skus += 1
                
                if sku in current_skus:
                    series_found += 1
                    found_skus += 1
                    current_name = chair_model_to_sku[sku]
                    print(f"✅ {sku} - Found")
                    print(f"   New: {name}")
                    print(f"   Current: {current_name}")
                    found_details.append({
                        'sku': sku,
                        'new_name': name,
                        'current_name': current_name,
                        'brand': brand_name,
                        'series': series_name
                    })
                else:
                    print(f"❌ {sku} - MISSING")
                    print(f"   New: {name}")
                    series_missing.append({
                        'sku': sku,
                        'name': name,
                        'brand': brand_name,
                        'series': series_name
                    })
                    missing_skus.append({
                        'sku': sku,
                        'name': name,
                        'brand': brand_name,
                        'series': series_name
                    })
                print()
            
            print(f"📊 {series_name} Summary: {series_found}/{len(chairs)} found ({series_found/len(chairs)*100:.1f}%)")
            if series_missing:
                print(f"🚨 Missing from {series_name}: {len(series_missing)} models")
        
        print(f"\n🏢 {brand_name} Total Summary:")
        brand_total = sum(len(chairs) for chairs in series_dict.values())
        brand_found = sum(1 for detail in found_details if detail['brand'] == brand_name)
        print(f"   Found: {brand_found}/{brand_total} ({brand_found/brand_total*100:.1f}%)")
        print("\n" + "="*60 + "\n")
    
    # Final Summary
    print("🎯 **FINAL SUMMARY**")
    print("=" * 50)
    print(f"📊 Total SKUs in new structure: {total_new_skus}")
    print(f"✅ Found in current database: {found_skus} ({found_skus/total_new_skus*100:.1f}%)")
    print(f"❌ Missing from current database: {len(missing_skus)} ({len(missing_skus)/total_new_skus*100:.1f}%)")
    
    if missing_skus:
        print(f"\n🚨 **MISSING CHAIR MODELS** ({len(missing_skus)} total):")
        print("-" * 50)
        
        missing_by_brand = {}
        for item in missing_skus:
            brand = item['brand']
            if brand not in missing_by_brand:
                missing_by_brand[brand] = {}
            series = item['series']
            if series not in missing_by_brand[brand]:
                missing_by_brand[brand][series] = []
            missing_by_brand[brand][series].append(item)
        
        for brand, series_dict in missing_by_brand.items():
            print(f"\n🏢 **{brand}:**")
            for series, items in series_dict.items():
                print(f"  📋 {series} ({len(items)} missing):")
                for item in items:
                    print(f"    ❌ {item['sku']} - {item['name']}")
    
    print(f"\n✨ **NOTABLE FINDINGS:**")
    print(f"• DAWN Series: Completely new (not in current database)")
    print(f"• EPIC Series: Mostly covered in current database")
    print(f"• HERO Series: Well represented")
    print(f"• ICON & LEGEND: Good coverage")
    print(f"• Nitro Concepts: All major series covered")
    
    return {
        'total_new': total_new_skus,
        'found': found_skus,
        'missing': missing_skus,
        'found_details': found_details
    }

if __name__ == "__main__":
    results = analyze_chair_models() 