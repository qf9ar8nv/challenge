import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Input, TextField, Modal, Backdrop, Fade } from '@material-ui/core';
import { SideBar, ChangePassword } from '../components/index';
import { } from '../MVVM/ViewModel/UserViewModel';

function MyPage() {
	const [Name, setName] = useState("d");
	const [Email, setEmail] = useState("test@gmail.com");
	const [GitId, setGitId] = useState("d");
	const [open, setopen] = useState(false);
	const handleOpen = () => {
		setopen(true);
	};
	const handleClose = () => {
		setopen(false);
	};
	const changeName = (e) => {
		setName(e.currentTarget.value);
	};
	const changeGitId = (e) => {
		setGitId(e.currentTarget.value);
	};
	const save = () => {
		console.log(Name);
		console.log(Email);
		console.log(GitId);
	};
	return (
		<div className="mypage">
			<SideBar />
			<Grid container className="profile">
				<Grid item xs={12}>
					<Grid container spacing={3} justify="center">
						<Grid item>
							<Box className="pro_img">
								<div>
									프로필 사진
								</div>
							</Box>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={4} alignItems="center" justify="center">
						<Grid item>
							<Box className="pro_name">
								이름
							</Box>
						</Grid>
						<Grid item>
							<TextField value={Name} onChange={changeName} className="pro_nameFix" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={2} alignItems="center" justify="center">
						<Grid item>
							<Box className="pro_email">
								이메일
							</Box>
						</Grid>
						<Grid item>
							<TextField value={Email} disabled className="pro_emailFix" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={3} alignItems="center" justify="center">
						<Grid item>
							<Box className="pro_github">
								github
							</Box>
						</Grid>
						<Grid item>
							<TextField value={GitId} onChange={changeGitId} className="pro_githubFix" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={3} justify="center">
						<Grid item>
							<Button className="pro_password" onClick={handleOpen}>
								패스워드 변경
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={3} justify="center">
						<Grid item>
							<Button className="pro_secession">
								회원탈퇴
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} />
				<Grid item xs={6}>
					<Grid container spacing={3} justify="center">
						<Grid item>
							<Button className="pro_save" onClick={save}>
								저장
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Modal
				className="modal"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className="modalPaper">
						<ChangePassword onClose={handleClose} />
					</div>
				</Fade>
			</Modal>
		</div>
	);
}

export default MyPage;
