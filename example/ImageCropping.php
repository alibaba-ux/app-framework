<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
	$targ_w = $targ_h = 150;
	$jpeg_quality = 90;

	$src = '../../images/400x400.jpg';
	$img_r = imagecreatefromjpeg($src);
	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );

	imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'],
	$targ_w,$targ_h,$_POST['w'],$_POST['h']);

	header('Content-type: image/jpeg');
	imagejpeg($dst_r,null,$jpeg_quality);

	exit;
}

// If not a POST request, display page below:

?><html>
	<head>
    <script type="text/javascript" src="http://style.china.alibaba.com/js/lib/fdev-v4/core/fdev-min.js"></script>
    <script type="text/javascript" src="http://style.china.alibaba.com/app/bp/js/openpf/lib/jquery.Jcrop.min.js"></script>
    <link rel="stylesheet" href="http://style.china.alibaba.com/app/bp/css/openpf/jquery.Jcrop-min.css" type="text/css" />
    <link rel="stylesheet" href="http://style.china.alibaba.com/app/bp/css/openpf/global.css" type="text/css" />
 <script>
    jQuery(function($){

      // Create variables (in this scope) to hold the API and image size
      var jcrop_api, boundx, boundy;
      
      $('#target').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        aspectRatio: 1
      },function(){
        // Use the API to get the real image size
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        // Store the API in the jcrop_api variable
        jcrop_api = this;
        jcrop_api.setSelect(getRandom());
      });   
   
     function getRandom() {
	    var dim = jcrop_api.getBounds();
        return [
            Math.round(0.3 * dim[0]),
            Math.round(0.6 * dim[1]),
            Math.round(0.6 * dim[0]),
            Math.round(0.3 * dim[1])
        ];
	 };
                
      function updatePreview(c)
      {
        if (parseInt(c.w) > 0)
        {
          var rx = 100 / c.w;
          var ry = 100 / c.h;

          $('.preview').css({
            width: Math.round(rx * boundx) + 'px',
            height: Math.round(ry * boundy) + 'px',
            marginLeft: '-' + Math.round(rx * c.x) + 'px',
            marginTop: '-' + Math.round(ry * c.y) + 'px'
          });
            $('#x').val(c.x);
            $('#y').val(c.y);
            $('#w').val(c.w);
            $('#h').val(c.h);
        }
      };    
      
      function checkCoords()
        {
            if (parseInt($('#w').val())) return true;
            alert('Please select a crop region then press submit.');
            return false;
        };
        
        
        $.use('ui-core,ui-draggable,ui-dialog', function(){
             $('#comp-editimg').dialog({
              center  :true,
              modalCss: {
                   backgroundColor: '#FFF'
              },
              draggable: {
                  handle: 'div.comp-editimg-header',
                  containment: 'body'
              },
              shim:true
             });
        });
        
        //click cancel button to close the dialog
        $('#comp-editimg-cancelbtn').click(function(){
          $('#comp-editimg').dialog('close');
        })
    });

  </script>
   <style type="text/css">
    .comp-editimg-article{
    width:580px;
    height:440px;
    background-color:#FFF;
   }
   .comp-editimg-actionbar{
    width:150px;
    height:35px;
    position:absolute;
    right:0px;
    top:410px;
  }
   </style>
	</head>

	<body>

	<div id="comp-editimg" class="comp-editimg-article">
		<div class="comp-editimg-header">图片编辑</div>
        <table>
			<tr>
				<td class="comp-editimg-mainimg">
					<img src="../../images/400x400.jpg" id="target" alt="Flowers" />
				</td>
				<td style="vertical-align:top;" >
					<div class="comp-editimg-100img">
						<img src="../../images/400x400.jpg" class="preview" alt="Preview" />
					</div>
				</td>				
			</tr>
		</table>
        <div class="comp-editimg-actionbar">
    		<form action="ImageCropping.php" method="post" onsubmit="return checkCoords();">
    			<input type="hidden" id="x" name="x" />
    			<input type="hidden" id="y" name="y" />
    			<input type="hidden" id="w" name="w" />
    			<input type="hidden" id="h" name="h" />
    			<input type="button" id="comp-editimg-cancelbtn" value="È¡Ïû" />
    			<input type="submit" id ="comp-editimg-sumbitbtn" value="±£´æ" />
    		</form>
        </div>
	</div>
	</body>

</html>
