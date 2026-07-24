# PowerShell script to download alternative images for missing categories
# Using different Unsplash photo IDs that are confirmed to work

$missingCategories = @(
    @{ slug = "cacao-cafe-rentes"; url = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80" },  # Coffee beans
    @{ slug = "intrants-materiel-agricole"; url = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80" },  # Tractor
    @{ slug = "exploitation-forestiere-bois"; url = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80" },  # Forest
    @{ slug = "jardinage-paysagisme"; url = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },  # Garden
    @{ slug = "librairie-papeterie"; url = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80" },  # Books library
    @{ slug = "vente-boissons-depots"; url = "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80" },  # Beverages
    @{ slug = "pharmacies-laboratoires"; url = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80" },  # Pharmacy
    @{ slug = "medecine-traditionnelle-bien-etre"; url = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },  # Wellness spa
    @{ slug = "universites-formation-professionnelle"; url = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80" },  # University
    @{ slug = "creches-garderies"; url = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80" },  # Children
    @{ slug = "tourisme-voyage-billetterie"; url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80" },  # Travel
    @{ slug = "evenementiel-loisirs"; url = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80" },  # Event party
    @{ slug = "banques-microfinances-assurances"; url = "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=80" },  # Bank
    @{ slug = "immobilier-agences-promotion"; url = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80" },  # Real estate
    @{ slug = "marketing-communication-medias"; url = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },  # Marketing
    @{ slug = "services-juridiques-comptables"; url = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },  # Legal office
    @{ slug = "energie-environnement"; url = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80" }  # Solar panels
)

$outputDir = "public/images/categories"

Write-Host "Downloading $($missingCategories.Count) missing category images..."

foreach ($cat in $missingCategories) {
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

Write-Host "Done! All images should now be in $outputDir"
