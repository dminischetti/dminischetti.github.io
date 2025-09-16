sudo -u nobody -- tncms-site-export 
-d elavon.www.us-corp-qa-3.tnqa.net
-m site_settings -m editorial_settings -m workflow   -m sections -m site_tags -m urlmap -m urlmap_nav -m block_instances -m block_templates -m components -m ad_regions
-f /tmp/elavon-qa3-to-dev3.zip

cd /sites/by-name/us-corp-qa-3/b/e/beechamp.www.us-corp-qa-3.tnqa.net/data/feeds
sudo -u nobody -- tncms-site-export -d elavon.www.us-corp-qa-3.tnqa.net -m block_templates -m components -f /sites/by-name/us-corp-qa-3/e/l/elavon.www.us-corp-qa-3.tnqa.net/data/feeds/elavon-btc-qa3.zip
sudo -u nobody -- tncms-site-export -d elavon.www.us-corp-qa-3.tnqa.net -m block_templates -m components -f /tmp/elavon-btc-qa3.zip
sudo -u nobody -- tncms-site-export -d elavon.www.us-corp-qa-3.tnqa.net -m site_settings -m editorial_settings -m workflow   -m sections -m site_tags -m urlmap -m urlmap_nav -m block_instances -m block_templates -m components -m ad_regions -f /tmp/elavon-qa3-to-dev3.zip
