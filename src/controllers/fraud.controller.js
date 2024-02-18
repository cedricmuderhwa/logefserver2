const {
  createActionLog,
  findActionLog,
  findManyActionLogs,
} = require("../services/actionlog.service");
const { updateContainer } = require("../services/container.service");
const {
  createFraud,
  findFraud,
  updateFraud,
  deleteFraud,
  findManyFrauds,
  lastInserted,
} = require("../services/fraud.service");
const {
  findFraudeur,
  updateFraudeur,
} = require("../services/fraudeur.service");
const { createInvitation } = require("../services/invitation.service");
const { updateLog, createLog } = require("../services/logs.service");
const { createMaterial } = require("../services/material.service");
const { createPrevenu } = require("../services/prevenu.service");
const { createPvs } = require("../services/pvs.service");
const { updateService } = require("../services/service.service");
const { updateStat } = require("../services/stat.service");
const { createSubstance } = require("../services/substance.service");

const generateFraudNo = async () => {
  const last = await lastInserted();
  if (last.length === 0) return parseInt(0);
  return last[0].index;
};

exports.createFraudHandler = async (req, res) => {
  const author = res.locals.user._id;
  const region = res.locals.user.region;
  const body = req.body;
  const io = await req.app.get("socket");

  const data = {
    status: body.status,
    index: (await generateFraudNo()) + 1,
    code: "CCNLFM".concat(
      ((await generateFraudNo()) + 1).toString().padStart(6, "0")
    ),
    signalement: {
      ...body,
      date: body.fraud_date,
      isComplete: true,
    },
    author,
    region,
  };

  const logs = await createLog({
    logs: [
      {
        date: new Date(),
        step: "Signalement du cas",
        content: body.observation,
        author,
      },
    ],
    author,
  });

  const fraud = await createFraud({ ...data, logs: logs._id });

  await updateService(
    { _id: body.service },
    { $addToSet: { cases: fraud._id } }
  );
  await updateStat({ region }, { $inc: { total_cases: parseInt(1) } });
  await createActionLog({
    fraud_id: fraud._id,
    title: `Nouveau cas suspect signalé #${fraud.code}`,
    action: "signaled",
    region,
    author,
  });

  const frauds = await findManyFrauds({
    page: 1,
    limit: 12,
    region,
    search: "none",
  });

  io.broadcast.emit("added_fraud", frauds);

  return res.json(frauds);
};

// exports.updateFraudHandler = async (req, res) => {
//     const _id = req.params.fraud_id
//     const update = req.body

//     const fraud = await findFraud({ _id })

//     if(!fraud) return res.sendStatus(404)

//     const updatedFraud = await updateFraud({ _id }, {$set: { ...update}}, {
//         safe: true,
//         upsert: true,
//         new: true
//     })

//     return res.json(updatedFraud)
// }

exports.getFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;
  const { page, limit, search } = req.query;
  const region = res.locals.user.region;

  let fraud = null;

  if (_id === "*") {
    fraud = await findManyFrauds({
      page: parseInt(page),
      limit: parseInt(limit),
      region,
      search,
    });
  } else {
    fraud = await findFraud({ _id });
  }

  if (!fraud) return res.sendStatus(404);

  return res.json(fraud);
};

exports.deleteFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  await deleteFraud({ _id });

  return res.send({ _id });
};

exports.updateFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;
  const update = req.body;
  const author = res.locals.user._id;
  const region = res.locals.user.region;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  switch (update?.action) {
    case "confirm":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Confirmation du cas",
              content: `Aprés vérification de l'information et des documents d'identification et de tracabilité presenté par le presumé fraudeur, le cas est confirmé. En attente de transfert ou non, pour réconnaissance microscopique et évaluation des substances minérales par le CEEC et orientation de la CNLFM pour instruction et cloture.`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { confirmed: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Cas suspect #${fraud.code} confirmé`,
        action: "confirmed",
        region,
        author,
      });

      break;

    case "archive":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
            isCaseClosed: true,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Classé comme cas non-frauduleux",
              content: `Aprés vérification de l'information et des documents d'identification et de tracabilité presenté par le presumé fraudeur, le cas est declaré non-frauduleux avec comme conséquences la cloture du dossier.`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { dismissed: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Cas suspect #${fraud.code} declaré non-frauduleux`,
        action: "dismissed",
        region,
        author,
      });

      break;

    case "transfer":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Transfert du cas",
              content: `Aprés constat des faits, le transfer du dossier vers la CNLFM provinciale a été jugé nécessaire pour réconnaissance microscopique et évaluation des substances minérales saisis par le CEEC, orientation, instruction et cloture du dossier. ${
                update.reception.observation
              }. Le transfert a été effectué en date du ${new Date(
                update?.reception.transfer_date
              )
                .toLocaleString("vh")
                .substring(
                  0,
                  10
                )} et la réception du dossier au bureau de la Coordination Provinciale de la CNLFM en date du ${new Date(
                update?.reception?.reception_date
              )
                .toLocaleString("vh")
                .substring(0, 10)}.`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { transferred: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} transferé au bureau de la coordination Provinciale du CNLFM.`,
        action: "transferred",
        region,
        author,
      });

      break;

    case "concluded-insito":
      await updateFraud(
        { _id },
        {
          $set: {
            isClosedInsito: true,
            status: update.conclusion.decision,
            conclusion: update.conclusion,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Instruction provisoire sur site",
              content: `Aprés constat des faits et instruction provisoire par un OPJ assermenté ou ministere publique, le cas a été jugé bénin, avec preuve à l'appui, par l'instructeur. l'autorisation de cloture du dossier devrait préalablement bénéficier de l'autorisation vérbale ou écrite de la coordination CNLFM Provinciale pour une cloture sur site. ${update.conclusion.observation}`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { conclusion: parseInt(1), conclusion_insito: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} instruit provisoirement sur site.`,
        action: "concluded_insito",
        region,
        author,
      });

      break;

    // This needs to be fixed by the terms...
    case "contest-insito":
      await updateFraud(
        { _id },
        {
          $set: {
            status: "transferred",
            isClosedInsito: false,
            conclusion: {
              isComplete: false,
              date: undefined,
              decision: undefined,
              no_decision: undefined,
              amende: undefined,
              observation: undefined,
            },
            execution: {
              isComplete: false,
              date: undefined,
              observation: undefined,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Contestation de la décision et transfert",
              content: `Le presumé fraudeur mécontent de la décision de la CNLFM, exige le transfer du dossier vers la CNLFM provinciale pour un traitement adequat, orientation, instruction et cloture du dossier.`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { transferred: parseInt(1), contested_transfer: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} contesté et transferé au bureau de la Coordination Provincial du CNLFM pour instruction.`,
        action: "contested_transfer",
        region,
        author,
      });

      break;

    case "oriented":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Dossier orienté et instruit",
              content: `Aprés réception du dossier, le cas est jugé comme étant ${update.orientation.classification} et est orienté vers le ${update.orientation.instruction} qui sera chargé de son instruction conformement aux dispositions du manuel de traitement des dossiers des cas de fraude. ${update.orientation.observation}`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat({ region: region }, { $inc: { oriented: parseInt(1) } });

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} orienté`,
        action: "oriented",
        region,
        author,
      });

      break;

    case "conclusion":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
            status: update.conclusion.decision,
            conclusion: update.conclusion,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Décision d'instruction",
              content: `Après instruction définitive du dossier par l'instructeur, la décision de la CNLFM est la suivante : \n ${update.conclusion.observation}. \nDecision en attente d'execution`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        { $inc: { conclusion: parseInt(1) } }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} instruit au sein la CNLFM.`,
        action: "concluded",
        region,
        author,
      });

      break;

    case "execution":
      await updateFraud(
        { _id },
        {
          $set: {
            ...update,
            status: update.execution.action,
            execution: update.execution,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Exécution de la décision",
              content: `Après la prise de décision de la CNLFM/Ministere Publique membre de la CNLFM, le niveau d'execution de la décision se présente comme suit : \n ${update.execution.observation}. `,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat({ region: region }, { $inc: { executed: parseInt(1) } });

      await createActionLog({
        fraud_id: fraud._id,
        title: `Décision d'instruction du dossier #${fraud.code} executé.`,
        action: "executed",
        region,
        author,
      });

      break;

    case "appel":
      await updateFraud(
        { _id },
        {
          $set: {
            appel: update.appel,
            status: update.status,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Dossier susceptible d'appel",
              content: `Le presumé fraudeur mécontent de la décision de la CNLFM/Ministère Publique est allé en appel. Le dossier est interjeté en appel au niveau de la ${update.appel.target}.\n ${update.appel.observation}`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        {
          $inc: {
            appel: parseInt(1),
            appel_first:
              update.appel.target !== "Cour de cassation"
                ? parseInt(1)
                : parseInt(0),
            appel_second:
              update.appel.target === "Cour de cassation"
                ? parseInt(1)
                : parseInt(0),
          },
        }
      );

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} interjeté en appel au ${
          update.appel.level === 1 ? "1er" : "2nd"
        } degré`,
        action: update.appel.level === 1 ? "appel_first" : "appel_second",
        region,
        author,
      });

      break;

    case "add-prevenus":
      const fraudeur = await findFraudeur({ _id: update.fraudeur });

      if (fraudeur) {
        await updateFraudeur(
          { _id: fraudeur._id },
          {
            $inc: { forfaits: parseInt(1) },
            $addToSet: { casesList: fraud.code },
          }
        );
      }

      const prevenu = await createPrevenu({
        ...update,
        author,
        region,
      });

      await updateFraud(
        { _id },
        {
          $addToSet: {
            prevenus: prevenu._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    case "add-files":
      const file = await createPvs({
        ...update,
        fraud_id: _id,
        region,
        author,
      });

      await updateFraud(
        { _id },
        {
          $addToSet: {
            files: file._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    case "add-substances":
      const substances = await createSubstance({
        ...update,
        author,
        region,
      });

      await updateContainer(
        { _id: substances.conditionnement },
        {
          $inc: {
            frequency: parseInt(1),
          },
        }
      );

      await updateFraud(
        { _id },
        {
          $addToSet: {
            substances: substances._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    case "add-invitations":
      const invitation = await createInvitation({
        ...update,
        service: update.service,
        author,
        region,
      });

      await updateFraud(
        { _id },
        {
          $addToSet: {
            invitations: invitation._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Réunion du CNLFM",
              content: update.observation,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      break;

    case "add-materials":
      const material = await createMaterial({
        ...update,
        author,
        region,
      });

      await updateFraud(
        { _id },
        {
          $addToSet: {
            materials: material._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    case "send-invite":
      await updateFraud(
        { _id },
        {
          $set: {
            meeting: update,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    case "closed":
      await updateFraud(
        { _id },
        {
          $set: {
            isCaseClosed: true,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      const closingReport = await createPvs({
        category: "Rapport de cloture",
        file_url: update.file_url,
        field: "execution",
        file_no: update.jugement_no,
        fraud_id: _id,
        region,
        author,
      });

      await updateFraud(
        { _id },
        {
          $addToSet: {
            files: closingReport._id,
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );

      await updateStat(
        { region: region },
        {
          $inc: {
            archived: parseInt(1),
            closedInsito: fraud.isClosedInsito ? parseInt(1) : parseInt(0),
            closed_by_cnlfm:
              !fraud.isCaseClosed && !fraud.appel.isComplete
                ? parseInt(1)
                : parseInt(0),
            closed_after_appel: fraud.appel.isComplete
              ? parseInt(1)
              : parseInt(0),
          },
        }
      );

      fraud.isClosedInsito
        ? await createActionLog({
            fraud_id: fraud._id,
            title: `Dossier #${fraud.code} cloturé sur sur site`,
            action: "closed_insito",
            region,
            author,
          })
        : null;

      !fraud.isCaseClosed && !fraud.appel.isComplete
        ? await createActionLog({
            fraud_id: fraud._id,
            title: `Dossier #${fraud.code} cloturé par la CNLFM.`,
            action: "closed_by_cnlfm",
            region,
            author,
          })
        : null;

      fraud.appel.isComplete
        ? await createActionLog({
            fraud_id: fraud._id,
            title: `Dossier #${fraud.code} cloturé aprés appel`,
            action: "closed_after_appel",
            region,
            author,
          })
        : null;

      await createActionLog({
        fraud_id: fraud._id,
        title: `Dossier #${fraud.code} cloturé définitivement et archivé`,
        action: "archived",
        region,
        author,
      });

      await updateLog(
        { _id: fraud?.logs._id },
        {
          $addToSet: {
            logs: {
              date: new Date(),
              step: "Conclusion définitive et archivage",
              content: `Ayant suivi toutes les étapes, le dossier est définitivement cloturé et archivé par la CNLFM. Cfr Jugement/Arret ${update.jugement_no}. \n ${update.observation}`,
              author,
            },
          },
        },
        {
          safe: true,
          upsert: true,
          new: true,
        }
      );
      break;

    default:
      break;
  }

  const updatedFraud = await findFraud({ _id: fraud._id });
  return res.send(updatedFraud);
};

exports.confirmFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;
  const update = req.body;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  // Here goes the data

  const updatedFraud = await updateFraud(
    { _id },
    { $set: { ...update } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.json(updatedFraud);
};

exports.receiveFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  // Here goes the logic
  const data = {
    date: new Date(),
    isComplete: true,
  };

  const updatedFraud = await updateFraud(
    { _id },
    { $set: { reception: data } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.json(updatedFraud);
};

exports.orientFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;
  const update = req.body;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  // Here goes the logic
  const data = {
    date: new Date(),
    isComplete: true,
    classification: update.classification,
    service_instructeur: update.service_instructeur,
  };

  const updatedFraud = await updateFraud(
    { _id },
    { $set: { orientation: data } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.json(updatedFraud);
};

exports.concludeFraudHandler = async (req, res) => {
  const _id = req.params.fraud_id;
  const update = req.body;

  const fraud = await findFraud({ _id });

  if (!fraud) return res.sendStatus(404);

  // Here goes the logic
  const data = {
    date: new Date(),
    isComplete: true,
    decision: update.decision,
  };

  const updatedFraud = await updateFraud(
    { _id },
    { $set: { conclusion: data } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.json(updatedFraud);
};

exports.readActionLogs = async (req, res) => {
  const _id = req.params.log_id;
  const region = res.locals.user.region;

  let logs = [];

  if (_id === "*") {
    logs = await findManyActionLogs({
      region,
    });
  } else {
    logs = await findActionLog({ _id });
  }

  if (!logs) return res.sendStatus(404);

  return res.json(logs);
};
