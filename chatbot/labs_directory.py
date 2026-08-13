import re
import logging

from data_paths import read_text

logger = logging.getLogger(__name__)

class LabsDirectory:
    def __init__(self, ts_file_path="lib/dept-data.ts"):
        self.ts_file_path = ts_file_path
        self.directory = {}
        self.load_directory()

    def load_directory(self):
        content = read_text(self.ts_file_path, feature="Laboratory lookups")
        if not content:
            return

        try:
            # Split by department blocks in DEPT_DATA
            dept_blocks = re.split(r"([\w-]+)\s*:\s*\{", content)
            
            for i in range(1, len(dept_blocks), 2):
                dept_key = dept_blocks[i].strip("'\"")
                dept_content = dept_blocks[i+1]
                
                # Find the labs array within the department content
                labs_match = re.search(r"labs\s*:\s*\[(.*?)\]\s*,", dept_content, re.DOTALL)
                if labs_match:
                    labs_list_str = labs_match.group(1)
                    # Match single line lab objects: { name: '...', desc: '...' }
                    # Handles both single and double quotes, and escaped characters
                    items = re.findall(r"\{\s*name:\s*['\"](.*?)['\"]\s*,\s*desc:\s*['\"](.*?)['\"]\s*\}", labs_list_str)
                    
                    self.directory[dept_key] = []
                    for item in items:
                        name = item[0]
                        desc = item[1]
                        self.directory[dept_key].append({
                            "name": name,
                            "description": desc
                        })
            logger.info(f"Loaded labs directory for {len(self.directory)} departments from dept-data.ts")
        except Exception as e:
            logger.error(f"Failed to parse labs directory: {e}")

    def get_labs_for_department(self, dept_key: str) -> list:
        return self.directory.get(dept_key.lower(), [])

    def search_labs_by_query(self, query: str) -> dict:
        """Search labs across all departments matching a query (e.g. 'python', 'iot', 'metasploit')."""
        query_lower = query.lower()
        results = {}
        for dept, labs in self.directory.items():
            matching_labs = []
            for lab in labs:
                if query_lower in lab["name"].lower() or query_lower in lab["description"].lower():
                    matching_labs.append(lab)
            if matching_labs:
                results[dept.upper()] = matching_labs
        return results
