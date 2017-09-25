#!/bin/bash
echo "Uninstalling icons and desktop entry..."
xdg-desktop-menu uninstall zeebe-modeler.desktop
xdg-icon-resource uninstall --size  16 zeebe-modeler
xdg-icon-resource uninstall --size  48 zeebe-modeler
xdg-icon-resource uninstall --size 128 zeebe-modeler
echo "Unregistering mime types..."
xdg-mime uninstall camunda-modeler-mime-types.xml
echo "done."
