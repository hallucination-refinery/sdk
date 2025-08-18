#!/usr/bin/env python3
"""Simple codebase discovery for documentation"""
import subprocess
import json
from pathlib import Path

def discover_structure():
    """Discover the current codebase structure"""
    
    # Get current branch
    branch = subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip()
    
    # Get all files
    all_files = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()
    
    # Find packages and apps
    packages = sorted([p.name for p in Path('packages').iterdir() if p.is_dir()])
    apps = sorted([a.name for a in Path('apps').iterdir() if a.is_dir()])
    
    # Group files by top-level directory
    by_dir = {}
    for f in all_files:
        top_dir = f.split('/')[0] if '/' in f else 'root'
        by_dir.setdefault(top_dir, 0)
        by_dir[top_dir] += 1
    
    result = {
        'branch': branch,
        'total_files': len(all_files),
        'packages': packages,
        'apps': apps,
        'file_distribution': by_dir
    }
    
    return result

if __name__ == '__main__':
    discovery = discover_structure()
    
    print(f"Branch: {discovery['branch']}")
    print(f"Total files: {discovery['total_files']}")
    print(f"\nPackages ({len(discovery['packages'])}):")
    for pkg in discovery['packages']:
        print(f"  - {pkg}")
    print(f"\nApps ({len(discovery['apps'])}):")
    for app in discovery['apps']:
        print(f"  - {app}")
    print(f"\nFile distribution:")
    for dir, count in sorted(discovery['file_distribution'].items(), key=lambda x: -x[1])[:10]:
        print(f"  {dir}: {count} files")
    
    # Save for reference
    Path('docs/tmp-workflow-setup/discovery.json').write_text(json.dumps(discovery, indent=2))
    print(f"\nDiscovery saved to docs/tmp-workflow-setup/discovery.json")