<?php
$file = $_FILES["file"]["name"];

if(!is_dir("img/"))
	mkdir("img/", 0777);

if($file && move_uploaded_file($_FILES["file"]["tmp_name"], "img/".$file))
{
	echo $file;
}