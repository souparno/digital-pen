<html>
  <head>
    <title>TODO supply a title</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <a href="/create" target="_blank"><h4>CREATE NEW BOARD</h4></a>
    <hr> 
    <table>
      <tr>
        <td>ID</td>
        <td>TITLE</td>
        <td>DESCRIPTION</td>
        <td>MODIFIED</td>
        <td>Action</td>
      </tr>
      <?php foreach ($data as $row) { ?>
        <tr>
          <td><?php echo $row['id'] ?></td>
          <td><?php echo $row['title'] ?></td>
          <td><?php echo $row['description'] ?></td>
          <td><?php echo $row['modified'] ?></td>
          <td>
            <table>
              <tr>
                <td><a target="_blank" href='/retrieve?id=<?php echo $row['id'] ?>'>View</a></td>
                <td>Delete</td>
              </tr>
            </table>
          </td>
        </tr>
        <?php }  ?>
    </table>
  </body>
</html>
