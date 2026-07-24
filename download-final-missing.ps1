# Download specific missing category images
$missing = @(
    @{ slug = "agriculture-vivriere-maraichere"; url = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },  # Farm field
    @{ slug = "peche-pisciculture"; url = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },  # Fishing
    @{ slug = "transformation-agro-alimentaire"; url = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },  # Food processing
    @{ slug = "supermarches-alimentation"; url = "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80" },  # Supermarket
    @{ slug = "marches-vivres-frais"; url = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80" },  # Fresh market
    @{ slug = "couture-mode-sur-mesure"; url = "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80" },  # Sewing
    @{ slug = "pressing-nettoyage"; url = "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=80" },  # Laundry
    @{ slug = "ecoles-colleges-lycees"; url = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80" }  # School
)

$outputDir = "public/images/categories"

foreach ($cat in $missing) {
    $outputFile = "$outputDir/$($cat.slug).jpg"
    Write-Host "Downloading $($cat.slug)..."
    try {
        Invoke-WebRequest -Uri $cat.url -OutFile $outputFile -TimeoutSec 30
        Write-Host "  OK: $($cat.slug).jpg"
    } catch {
        Write-Host "  FAILED: $($cat.slug) - $($_.Exception.Message)"
    }
}

Write-Host "Done!"
