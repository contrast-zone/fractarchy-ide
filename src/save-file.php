<?php
    $dir = urldecode($_POST['dir']);
    $fname = urldecode($_POST['fname']);
    $fcontents = urldecode($_POST['fcontents']);

    chdir("../" . $dir) or die("ERROR! Unable to open file directory.");
    $myfile = fopen($fname, "w") or die("ERROR! Unable to open file for writing.");
    fwrite($myfile, $fcontents) or die("ERROR! Unable to write to file.");
    fclose($myfile) or die("ERROR! Unable to close file after writing.");

    echo "Success. Changes to '" . $dir . $fname . "' are permanently memorized.";
?>
