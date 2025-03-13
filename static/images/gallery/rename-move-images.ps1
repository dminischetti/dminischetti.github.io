# Read each line from the input file
Get-Content .\images.txt | ForEach-Object {
    # Use regex to extract the description and file path.
    if ($_ -match '!\[(.*?)\]\((.*?)\)') {
        $desc = $matches[1]
        $source = $matches[2]

        # Create an SEO-friendly file name:
        # 1. Lowercase the description.
        # 2. Remove any character that is not a letter, digit, whitespace, underscore, or dash.
        # 3. Replace whitespace with a single dash.
        # 4. Remove multiple dashes.
        $seoName = $desc.ToLower() `
            -replace '[^\w\s-]', '' `
            -replace '\s+', '-' `
            -replace '-+', '-'

        # Get the file extension (e.g., .jpg)
        $extension = [System.IO.Path]::GetExtension($source)

        # Construct the destination file name in the current directory.
        $destFile = ".\$seoName$extension"

        # Move (or rename) the file to the current folder with the new name.
        Move-Item $source -Destination $destFile -Force

        Write-Output "Moved '$source' to '$destFile'"
    }
}