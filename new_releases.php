<?php

	require_once('config.php');
	require_once('notification.class.php');
	require_once('user.class.php');
	require_once('report.class.php');


	$db_connection = mysqli_init();
	if (!$db_connection) { die('mysqli_init failed'); }
	if (!$db_connection->real_connect($MYSQLI_HOST, $MYSQLI_USERNAME, $MYSQLI_PASSWORD, $MYSQLI_DATABASE)) { die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error()); }


	$users = $db_connection->query('SELECT * FROM user WHERE active = 1');

	while($user = $users->fetch_assoc())
	{

		$deactivateResult = $db_connection->query('UPDATE `notification` SET `active`= 0 WHERE user_id = \''.$user['user_id'].'\'');

		$notifications = array();
		$notifications_id = array();
		$report = new Report();
		$report->user_id = $user['user_id'];
		$report->insert = 0;
		$report->update = 0;
		$report->delete = 0;

		$notifications_db = $db_connection->query('SELECT * FROM notification WHERE user_id = \''.$user['user_id'].'\'');
		
		while($notification = $notifications_db->fetch_assoc())
		{ 
			array_push($notifications, new Notification($notification, false));
			array_push($notifications_id, new Notification($notification, true));
		}

		$xml = getLastFMXml('user.getnewreleases', $user['lastfm_key'], '&user=' . $user['lastfm_name']);

		if(isset($xml->albums->album))
		{
			foreach ($xml->albums->album as $album)
			{
				$db_notification = new Notification(null, true);
				$db_notification->user_id = $user['user_id'];
				$db_notification->artist_mbid = (string)$album->artist->mbid[0];
				$db_notification->name = (string)$album->name[0];
				$db_notification->type = 'album';
				$db_notification->active = 0;

				checkNotificationAndUpdate($db_notification, $album, 'album');
			}
		}

		if(isset($xml->tracks->track))
		{
			foreach ($xml->tracks->track as $track)
			{
				$db_notification = new Notification(null, true);
				$db_notification->user_id = $user['user_id'];
				$db_notification->artist_mbid = (string)$track->artist->mbid[0];
				$db_notification->name = (string)$track->name[0];
				$db_notification->type = 'track';
				$db_notification->active = 0;

				checkNotificationAndUpdate($db_notification, $track, 'track');
			}
		}

		foreach($xml as $key => $value)
		{
			if($key != 'albums' && $key != 'tracks')
			{
				curl_setopt_array($ch = curl_init(), array(
					URLOPT_RETURNTRANSFER, TRUE,
					CURLOPT_URL => "https://api.pushover.net/1/messages.json", 
					CURLOPT_POSTFIELDS => array(
						"token" => $PUSHOVER_APP_TOKEN, 
						"user" => $PUSHOVER_USER_KEY, 
						"message" => "You have found a new type: ". $key
						)
					)
				);
				curl_exec($ch);
				curl_close($ch);
			}
		}

		$deleteResult = $db_connection->query('DELETE FROM `notification` WHERE user_id = \''.$user['user_id'].'\' AND active = 0;');
		$report->delete = $db_connection->affected_rows;
		$db_connection->query(insert_update_query_from_object($report, 'report')) or die(mysqli_error($db_connection));
	}
	
	$db_connection->close();
	exit(0);


	function checkNotificationAndUpdate($db_notification, $item, $type)
	{
		global $db_connection, $notifications, $notifications_id, $user, $report;

		$array_index = -1;
		if(in_array($db_notification, $notifications)) { $array_index = array_search($db_notification, $notifications); }
		if($array_index >= 0) { $db_notification = $notifications_id[$array_index]; $report->update++; } 
		else
		{
			$report->insert++;
			$date = date("l jS \of F Y", strtotime($item[@releasedate]));
			$message = "{$item->artist->name} has a new {$type}, {$item->name[0]}, coming up on {$date}.";
			sendPushOverNotification($message);
		}

		$db_notification->active = 1;
		$insertResult = $db_connection->query(insert_update_query_from_object($db_notification, 'notification'));
	}

	function sendPushOverNotification($message)
	{
		global $db_connection, $notifications, $notifications_id, $user, $report, $PUSHOVER_APP_TOKEN;
		curl_setopt_array($ch = curl_init(), array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_URL => "https://api.pushover.net/1/messages.json", 
			CURLOPT_POSTFIELDS => array(
				"token" => $PUSHOVER_APP_TOKEN, 
				"user" => $user['pushover_key'], 
				"message" => $message
				)
			)
		);
		curl_exec($ch);
		curl_close($ch);
	}

	function insert_update_query_from_object($object, $table)
	{
		global $db_connection;

		$reflect = new ReflectionClass($object);
		$properties   = array_map(function ($property) { return $property->name; }, $reflect->getProperties(ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED));
		$updateArray = array();
		$values = array();

		foreach($properties as $property) { array_push($updateArray, '`' . $property . '`' . '=\'' . $db_connection->real_escape_string($object->{$property}) . '\' '); }
		foreach($object as $value) { array_push($values, $db_connection->real_escape_string($value)); }

		$query = 'INSERT INTO `' . $table . '` (`' . implode('`, `', $properties) . '`) VALUES (\'' . implode($values, '\', \'') . '\') ON DUPLICATE KEY UPDATE ' . implode(', ', $updateArray);
		return $query;
	}
	
	function getLastFMXml($method, $apiKey, $params)
	{
		$url = 'http://ws.audioscrobbler.com/2.0/?method=' . $method . '&api_key=' . $apiKey . $params;

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);

		$data = curl_exec($ch);
		curl_close($ch);

		return new SimpleXMLElement($data);
	}
	
?>
