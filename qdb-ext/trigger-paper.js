if(!paper_toast){
	var paper_toast = document.createElement("paper-toast");
			paper_toast.setAttribute("id", "mytoast");
			paper_toast.setAttribute("text", "MID copied!");
			document.body.appendChild(paper_toast);
}

paper_toast.show();