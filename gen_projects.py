import os
import json

portfolio_dir = r'd:\portfolio Website\portfolio-s\public\portfolio'
folders = [f for f in os.listdir(portfolio_dir) if os.path.isdir(os.path.join(portfolio_dir, f))]

colors = ['rgba(189, 0, 255, 0.18)', 'rgba(0, 240, 255, 0.18)', 'rgba(242, 78, 30, 0.18)', 'rgba(5, 80, 255, 0.18)', 'rgba(255, 199, 0, 0.18)', 'rgba(255, 154, 0, 0.18)', 'rgba(255, 97, 246, 0.18)']

projects = []
for i, folder in enumerate(folders):
    folder_path = os.path.join(portfolio_dir, folder)
    files = os.listdir(folder_path)
    main_image = next((f for f in files if f.startswith('mainone.')), None)
    if not main_image:
        continue
    
    projects.append({
        'id': folder.lower().replace(' ', '-'),
        'title': folder,
        'category': 'creative',
        'desc': f'Portfolio project for {folder}.',
        'role': 'UX/UI Designer',
        'timeline': '2024',
        'tools': 'Figma, Adobe CC',
        'link': '#',
        'color': colors[i % len(colors)],
        'image': f'/portfolio/{folder}/{main_image}'
    })

js_code = '  const projectsData = [\n'
for p in projects:
    js_code += '    {\n'
    for k, v in p.items():
        js_code += f"      {k}: '{v}',\n"
    js_code += '    },\n'
js_code += '  ];'

with open('projects_gen.txt', 'w') as f:
    f.write(js_code)
