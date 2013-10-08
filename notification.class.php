<?php

class Notification
{
	public $notification_id;
	public $user_id;
	public $artist_mbid;
	public $name;
	public $type;
	public $active;

	public function __construct($data, $set_id)
	{
		if(!isset($set_id)) { $set_id = true; }
		if(isset($data) && !empty($data))
		{
			$refclass = new ReflectionClass($this);
			foreach ($refclass->getProperties() as $property)
			{
				$name = $property->name;
				if ($property->class == $refclass->name && isset($data[$name]) && !empty($data[$name]))
				{
					if($set_id) { $this->$name = $data[$name]; }
					else if($name != 'notification_id'){ $this->$name = $data[$name]; }
				}
			}
		}
	}

	public function getNotificationId()
	{
		return $this->notification_id;
	}

	public function setNotificationId($id)
	{
		$this->notification_id = $id;
	}

}

?>