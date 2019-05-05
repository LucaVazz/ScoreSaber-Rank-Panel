import logging
import os
import glob
import shutil

from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT_PATH = os.path.dirname(__file__)
DIST_PATH = os.path.join(ROOT_PATH, 'dist')
SRC_PATH = os.path.join(ROOT_PATH, 'src')


logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')

logging.info('Cleaning Dist...')
for f in glob.glob(os.path.join(DIST_PATH, '*')):
	# will ignore hidden files like .gitkeep
	os.remove(f)

logging.info('Building sites...')
env = Environment(
    loader=FileSystemLoader(SRC_PATH),
    autoescape=select_autoescape(['html', 'xml'])
)

sites = ['config', 'panel']
for site_name in sites:
	site_text = env.get_template(f'{site_name}.jinja2').render()
	site_dist_path = os.path.join(DIST_PATH, f'{site_name}.html')
	with open(site_dist_path, 'w') as f:
		f.write(site_text)

logging.info('Creating zip...')
shutil.make_archive(os.path.join(ROOT_PATH, 'dist'), 'zip', DIST_PATH)
shutil.move(os.path.join(ROOT_PATH, 'dist.zip'), os.path.join(DIST_PATH, 'dist.zip'))

logging.info('Done!')
