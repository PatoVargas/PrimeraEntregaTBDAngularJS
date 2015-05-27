<?php 
	$user=json_decode(file_get_contents('php://input'));
	if($user->nombre == 'pato' && $user->pass == '1234')
		print 'succes';
	else print 'error';
?>