<?php
	set_include_path('google-api-php-client/src/Google/autoload.php');
	header('Content-Type: application/json');
	if(isset($_POST) && $_POST != null) {
		switch($_POST["query"]) {
		case "tableids":
			$tableIds = array("1JFf3z0WVkO0RJOfWNnPvUJ3KFwtHg42Rm-Y3z-LJ", "1N5MESRSevHsiuQilArUgqb_QDaxCyBk-HhMMh_3f");
			echo json_encode($tableIds);
			break;
		case "empData":
			break;
		}
	}
	else echo "INVALID";

	function getEmployeeData() {
		$client = new Google_Client();
		$client->setDeveloperKey("AIzaSyAP6HP8YwGUXYu4AZ_syH2SjlxqfwkLHLU");
	}
?>
