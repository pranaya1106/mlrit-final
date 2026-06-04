#!/bin/bash

analyze_panels() {
    local file=$1
    echo "=== $file ==="
    
    # Get all panel IDs
    panels=$(grep -n "div class=\"dept-panel" "$file" | cut -d: -f1)
    
    if [ -z "$panels" ]; then
        echo "No panels found"
        return
    fi
    
    # Convert to array
    local -a arr=($panels)
    
    for i in "${!arr[@]}"; do
        panel_start=${arr[$i]}
        
        # Find next panel or end marker
        if [ $i -lt $((${#arr[@]} - 1)) ]; then
            panel_end=${arr[$((i+1))]}
        else
            panel_end=$(wc -l < "$file")
        fi
        
        # Count closing divs before next panel
        closing_divs=$(sed -n "$((panel_end-10)),$((panel_end-1))p" "$file" | grep -c "^[[:space:]]*</div>")
        
        # Check the actual pattern of last 3 lines before next panel
        echo "Panel $((i+1)): lines $panel_start-$panel_end, closing divs in last 10 lines: $closing_divs"
        echo "  Last 4 lines before line $panel_end:"
        sed -n "$((panel_end-4)),$((panel_end-1))p" "$file" | sed 's/^/    /'
        echo ""
    done
}

for file in aeronautical.html cse.html ece.html eee.html mechanical.html it.html aiml.html csit.html mba.html freshman.html; do
    if [ -f "$file" ]; then
        analyze_panels "$file"
        echo ""
    fi
done

