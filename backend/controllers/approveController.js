const Approve = require('../models/approveModel');
const Challenge = require('../models/challengeModel');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');

async function CreateApprove(req, res) {
	try {
		const { ch_id, user_id, type, message, request_date } = req.body;
		const _id = ObjectID(ch_id);
		const date = request_date.split("-")
		const equal_month = date[0] + "-" + date[1]
		if (message.length > 100) {
			throw "message를 100자 이내로 작성바랍니다."
		}
		// type 0: 승인, type 1: 휴가
		Approve.create(ch_id, user_id, type, message, request_date, false)
		res.status(201).json({ result: true })

	} catch (err) {
		console.log(err);
		res.status(401).json({ error: 'error' })
	}
}

function DeleteApprove(req, res) {
	const approve_id = req.params.approve_id;
	const id = ObjectID(approve_id);

	Approve.findByIdAndDelete(id, (err, doc) => {
		if (err) {
			console.log(err)
		}
		else {
			console.log("approve 삭제")
			console.log(doc)
			res.send(doc)
		}
	})

}

async function GetApproveList(req, res) {
	try {
		const { user_id } = req.query;
		const ch_id = req.params.ch_id;

		approves = await Approve.find({
			$and: [{ ch_id: ch_id }, { state: false },
			{ user_id: { $ne: user_id } }, { approve_user: { $nin: user_id } }]
		}).sort({ _id: -1 })

		res.status(200).json({ result: approves })
	} catch (err) {
		console.log(err)
		res.status(401).json({ error: 'erreor' })
	}
}

async function GetAllApproveList(req, res) {
	try {
		const ch_id = req.params.ch_id;

		approves = await Approve.find({
			$and: [{ ch_id: ch_id }, { state: false }]
		}).sort({ _id: -1 })

		res.status(200).json({ result: approves })
	} catch (err) {
		console.log(err)
		res.status(401).json({ error: 'erreor' })
	}
}


async function ConfirmApprove(req, res) {		// approve 승인 누르면 count 증가시키는 api
	try {
		const approve_id = req.params.approve_id;
		const Id = ObjectID(approve_id)
		const { user_id, ch_id } = req.body;

		const ch = await Challenge.findById(ch_id)

		const session = await mongoose.startSession(); // 무결성 보장을 위한 transation 처리
		try {
			await session.withTransaction(async () => {
				var userArray, userCnt, approveState;

				//approve 업데이트 계산
				await Approve.findOneById(Id).then((ap) => {
					userArray = [...ap.approve_user]

					if (userArray.indexOf(user_id) >= 0) throw new Error('이미 허용 눌렀음')

					userArray.push(user_id)
					userCnt = ap.approve_cnt + 1;
					approveState = 0;

					_entireCnt = ch.challenge_user_num

					if (userCnt / _entireCnt >= 0.5) {
						approveState = 1;
					}
				})

				//approve 업데이트 적용
				await Approve.findByIdAndUpdate(Id, {
					$set: {
						approve_user: userArray,
						approve_cnt: userCnt,
						state: approveState
					}
				}, { new: true, useFindAndModify: false }, (err, doc) => {
					if (err) {
						throw new Error('approve 승인 오류')
					}
					else {
						console.log("approve 승인")
						console.log(doc._id)
					}
				})
			});
			session.endSession();
		}
		catch (err) {
			await session.abortTransaction();
			session.endSession();
			throw new Error("transaction 처리 에러");
		}

		res.send('true')
	} catch (err) {
		console.log(err);
		res.send('false');
	}
}

function GetApproveInfo(req, res) {
	const approve_id = req.params.approve_id;
	const id = ObjectID(approve_id);
	Approve.findOneById(id)
		.then((ap) => {
			console.log("approve 받음")
			console.log(ap)
			res.send(ap)
		})
		.catch((err) => {
			console.log(err)
			res.send(err)
		})
}

module.exports = {
	createApprove: CreateApprove,
	deleteApprove: DeleteApprove,
	getApproveList: GetApproveList,
	confirmApprove: ConfirmApprove,
	getApproveInfo: GetApproveInfo,
	getAllApproveList: GetAllApproveList
};