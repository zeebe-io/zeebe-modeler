PRG=$0
while [ -h "$PRG" ]; do
    ls=`ls -ld "$PRG"`
    link=`expr "$ls" : '^.*-> \(.*\)$' 2>/dev/null`
    if expr "$link" : '^/' 2> /dev/null >/dev/null; then
        PRG="$link"
    else
        PRG="`dirname "$PRG"`/$link"
    fi
done

WORKING_DIR=`dirname "$PRG"`

#!/bin/bash
echo "Uninstalling icons and desktop entry..."
xdg-desktop-menu uninstall zeebe-modeler.desktop
xdg-icon-resource uninstall --size  16 zeebe-modeler
xdg-icon-resource uninstall --size  48 zeebe-modeler
xdg-icon-resource uninstall --size 128 zeebe-modeler
echo "Unregistering mime types..."
xdg-mime uninstall $WORKING_DIR/mime-types.xml
echo "done."
