# PowerShell script to download category images from Unsplash
# These images will be stored locally for faster rendering

$categories = @(
    @{ slug = "agriculture-vivriere-maraichere"; url = "https://images.unsplash.com/photo-1625246333195-58197bd47f3b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "cacao-cafe-rentes"; url = "https://images.unsplash.com/photo-1625246333195-58197bd47f3b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "elevage-bovin-porcin-volaille"; url = "https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "peche-pisciculture"; url = "https://images.unsplash.com/photo-1519708227418-e8cba8241dce?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "transformation-agro-alimentaire"; url = "https://images.unsplash.com/photo-1595855709912-6b8d5e9d9a44?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "intrants-materiel-agricole"; url = "https://images.unsplash.com/photo-1625246333195-58197bd47f3b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "exploitation-forestiere-bois"; url = "https://images.unsplash.com/photo-1625246333195-58197bd47f3b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "jardinage-paysagisme"; url = "https://images.unsplash.com/photo-1625246333195-58197bd47f3b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "supermarches-alimentation"; url = "https://images.unsplash.com/photo-1578916171728-5666d5264314?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "boutiques-mode-vetements"; url = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "electronique-informatique-telephones"; url = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "electromenager-maison"; url = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "quincaillerie-materiaux-construction"; url = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "pieces-detachees-auto-moto"; url = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "librairie-papeterie"; url = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "cosmetiques-parfumerie-beaute"; url = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "marches-vivres-frais"; url = "https://images.unsplash.com/photo-1595855709912-6b8d5e9d9a44?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "vente-boissons-depots"; url = "https://images.unsplash.com/photo-1578916171728-5666d5264314?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "coiffure-instituts-beaute-spa"; url = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "couture-mode-sur-mesure"; url = "https://images.unsplash.com/photo-1524498250077-390f776953dd?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "pressing-nettoyage"; url = "https://images.unsplash.com/photo-1517677208171-0bc12f949501?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "mecanique-entretien-vehicules"; url = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "plomberie-electricite-bricolage"; url = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "imprimerie-infographie-design"; url = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "reparation-electronique-informatique"; url = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "froid-climatisation"; url = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "menuiserie-bois-alu-soudure"; url = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "securite-gardiennage"; url = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "hopitaux-cliniques-centres-sante"; url = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "pharmacies-laboratoires"; url = "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "medecine-traditionnelle-bien-etre"; url = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "ecoles-colleges-lycees"; url = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "universites-formation-professionnelle"; url = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "creches-garderies"; url = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "hotels-auberges-hebergement"; url = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "restaurants-traiteurs"; url = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "snack-bars-cabarets-vie-nocturne"; url = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "boulangeries-patisseries"; url = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "tourisme-voyage-billetterie"; url = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "evenementiel-loisirs"; url = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "banques-microfinances-assurances"; url = "https://images.unsplash.com/photo-1554224155-984ce6474fb8?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "btp-construction-genie-civil"; url = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "transport-logistique"; url = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "immobilier-agences-promotion"; url = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "marketing-communication-medias"; url = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "services-juridiques-comptables"; url = "https://images.unsplash.com/photo-1554224155-984ce6474fb8?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "industrie-manufacture"; url = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80" },
    @{ slug = "energie-environnement"; url = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80" }
)

$outputDir = "public/images/categories"

Write-Host "Downloading $($categories.Count) category images..."

foreach ($cat in $categories) {
    $outputFile = "$outputDir/$($cat.slug).jpg"
    if (Test-Path $outputFile) {
        Write-Host "Skipping $($cat.slug) (already exists)"
        continue
    }
    Write-Host "Downloading $($cat.slug)..."
    try {
        Invoke-WebRequest -Uri $cat.url -OutFile $outputFile -TimeoutSec 30
        Write-Host "  OK: $($cat.slug).jpg"
    } catch {
        Write-Host "  FAILED: $($cat.slug) - $($_.Exception.Message)"
    }
}

Write-Host "Done! Images saved to $outputDir"
