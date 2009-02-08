all: zip

zip: png $(wildcard *.html)
	zip ../dist/ProveItDocs.zip *.html *.png *.css

png: sidebar_labelled.png open_edit_popup_cropped_labelled.png open_new_reference_menu_cropped_labelled.png

sidebar_labelled.png: sidebar_labelled.svg only_sidebar.png
	inkscape sidebar_labelled.svg -e sidebar_labelled.png

open_edit_popup_cropped_labelled.png: open_edit_popup_cropped_labelled.svg open_edit_popup_cropped.png
	inkscape open_edit_popup_cropped_labelled.svg -e open_edit_popup_cropped_labelled.png 

open_new_reference_menu_cropped_labelled.png: open_new_reference_menu_cropped_labelled.svg open_new_reference_menu_cropped.png
	inkscape open_new_reference_menu_cropped_labelled.svg -e open_new_reference_menu_cropped_labelled.png

