#!/bin/bash

# Function to analyze file
analyze_file() {
    local file=$1
    echo "=== $file ==="
    
    # Find all TAB lines
    tab_lines=$(grep -n "<!-- TAB\|<!-- ===" "$file" | cut -d: -f1)
    
    if [ -z "$tab_lines" ]; then
        echo "No TAB markers found"
        echo ""
        return
    fi
    
    # Convert to array
    local -a arr=($tab_lines)
    
    # For each TAB line except the last
    for i in "${!arr[@]}"; do
        start_line=${arr[$i]}
        
        if [ $i -lt $((${#arr[@]} - 1)) ]; then
            end_line=${arr[$((i+1))]}
        else
            # For last TAB, look for dept-body__panels close
            end_line=$(grep -n "</div><!-- .dept-body__panels -->" "$file" | cut -d: -f1)
        fi
        
        echo "TAB $((i+1)) at line $start_line, ends before line $end_line:"
        
        # Show last 5 lines before next TAB
        start_print=$((end_line - 5))
        sed -n "${start_print},${end_line}p" "$file" | head -6
        echo ""
    done
}

# Check each file
for file in aeronautical.html cse.html ece.html eee.html mechanical.html it.html aiml.html csit.html mba.html freshman.html; do
    if [ -f "$file" ]; then
        analyze_file "$file"
        echo ""
    fi
done

