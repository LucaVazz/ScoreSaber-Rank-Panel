import logging
import os
import glob
import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT_PATH = os.path.dirname(__file__)
DIST_PATH = os.path.join(ROOT_PATH, 'dist')
SRC_PATH = os.path.join(ROOT_PATH, 'src')


logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')

logging.info('Cleaning Dist...')
for root_path, dirs, files in os.walk(DIST_PATH, topdown=False):
    for file_name in files:
    	if ('.gitkeep' not in file_name):
        	os.remove(os.path.join(root_path, file_name))

logging.info('Building sites...')
env = Environment(
    loader=FileSystemLoader(SRC_PATH),
    autoescape=select_autoescape(['html', 'xml'])
)
for fp in glob.glob(os.path.join(SRC_PATH, '*.jinja2')):
	site_name = Path(fp).stem
	site_text = env.get_template(f'{site_name}.jinja2').render()
	site_dist_path = os.path.join(DIST_PATH, f'{site_name}.html')
	with open(site_dist_path, 'w') as f:
		f.write(site_text)

logging.info('Copying JS...')
for fp in glob.glob(os.path.join(SRC_PATH, '*.js')):
	shutil.copy(fp, fp.replace(SRC_PATH, DIST_PATH))

logging.info('Copying static files...')
static_src_path = os.path.join(SRC_PATH, 'static')
for fp in glob.glob(os.path.join(static_src_path, '**/*.*'), recursive=True):
	shutil.copy(fp, fp.replace(static_src_path, DIST_PATH))

logging.info('Creating zip...')
shutil.make_archive(os.path.join(ROOT_PATH, 'dist'), 'zip', DIST_PATH)
shutil.move(os.path.join(ROOT_PATH, 'dist.zip'), os.path.join(DIST_PATH, 'dist.zip'))

logging.info('Done!')
