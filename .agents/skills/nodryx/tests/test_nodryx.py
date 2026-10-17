import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path
from urllib.parse import unquote

ROOT=Path(__file__).resolve().parent.parent

def load_script(filename):
    spec=importlib.util.spec_from_file_location(filename.replace('.py',''),ROOT/'scripts'/filename)
    mod=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

class NodryxV2Tests(unittest.TestCase):
    def test_frontmatter_and_local_links(self):
        s=(ROOT/'SKILL.md').read_text(encoding='utf-8')
        self.assertTrue(s.startswith('---\n'))
        self.assertIn('name: nodryx',s)
        self.assertIn('description:',s)
        self.assertLess(len(s.splitlines()),500)
        for rel in re.findall(r'\]\((references/[^)]+)\)',s):
            self.assertTrue((ROOT/rel).exists(),rel)

    def test_query_pack_is_not_fake_pin_results(self):
        mod=load_script('pinterest_query_pack.py')
        pack=mod.query_pack('clinica de estética','premium')
        self.assertEqual(len(pack['items']),10)
        self.assertEqual(pack['status'],'search_urls_generated_no_browsing')
        self.assertTrue(all(not i['verified_pin'] for i in pack['items']))
        self.assertIn('clinica de estética',unquote(pack['items'][0]['search_url']))
        with self.assertRaises(ValueError):mod.query_pack('   ')

    def test_contrast(self):
        mod=load_script('contrast.py')
        self.assertAlmostEqual(mod.contrast('#000000','#FFFFFF'),21,places=4)
        self.assertAlmostEqual(mod.contrast('#fff','#fff'),1,places=4)
        with self.assertRaises(ValueError):mod.contrast('not-hex','#fff')

    def test_manifest_and_refs(self):
        mod=load_script('validate_project.py')
        p=json.loads((ROOT/'assets'/'PROJECT_MANIFEST.example.json').read_text())
        r=json.loads((ROOT/'assets'/'REFERENCES.example.json').read_text())
        errors,_=mod.validate(p,r)
        self.assertEqual(errors,[])
        r['references'][0]['visual_status']='inspected_pixels'
        self.assertTrue(mod.validate(p,r)[0])
        r['references'][0]['image_evidence']='some-local-evidence.png'
        self.assertFalse(mod.validate(p,r)[0])
        p['fonts']=['a','b','c']
        self.assertTrue(mod.validate(p,r)[0])

if __name__=='__main__': unittest.main()
