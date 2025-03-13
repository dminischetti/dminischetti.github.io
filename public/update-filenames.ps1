# Define input and output file names (adjust if needed)
$inputFile = "gallery.md"    # your markdown file with lines like: ![Description](202407/oldfilename.jpg)
$outputFile = "gallery2.md"  # new markdown file with updated filenames

# Function to create an SEO-friendly filename from a description
function To-SEOName($name) {
    # Convert to lowercase
    $name = $name.ToLower()
    # Remove characters that are not letters, numbers, underscore, space, or dash
    $name = [regex]::Replace($name, '[^\w\s-]', '')
    # Replace one or more whitespace with a single dash
    $name = [regex]::Replace($name, '\s+', '-')
    # Collapse multiple dashes into one
    $name = [regex]::Replace($name, '-+', '-')
    return $name
}

# Read the entire content of the input file as a single string
$content = Get-Content $inputFile -Raw

# Regex pattern explanation:
# - It captures the description in the first group (between ![ and ])
# - It then matches a folder name (digits) and a slash,
# - Followed by any characters until it finds the file extension (captured in group 2)
$pattern = '!\[(.*?)\]\(\d+\/[^)]+?(\.\w+)\)'

# Use .NET's Regex Replace with a script block as the evaluator.
# For each match, extract the description, convert it to an SEO-friendly name, and build the new markdown line.
$newContent = [regex]::Replace($content, $pattern, {
    param($match)
    $desc = $match.Groups[1].Value
    $ext = $match.Groups[2].Value
    $newName = To-SEOName $desc
    return "![{0}]({1}{2})" -f $desc, $newName, $ext
})

# Write the updated content to the output file
Set-Content -Path $outputFile -Value $newContent

Write-Output "Updated markdown file saved as $outputFile"
