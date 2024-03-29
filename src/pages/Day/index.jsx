import "./day.css"
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import useSound from "use-sound";
import julgamentoSound from "../../assets/julgamento-soundeffect.mp3"
import morteSound from "../../assets/morte-soundeffect.mp3"
import bombFizzle from "../../assets/bomb fizzle effect.mp3"
import bombBoom from "../../assets/bomb effect.mp3"
import gunSound from "../../assets/gun shot effect.mp3"
import dayMusic from "../../assets/daysounds/daymusic.mp3"
import roosterEffect from "../../assets/daysounds/rooster-soundeffect.mp3"
import deadEffectMusic from "../../assets/daysounds/sadDeathMusic.mp3"
import cancelEffectMusic from "../../assets/daysounds/cancelDeathMusic.mp3"
import pesteDeathMusic from "../../assets/daysounds/pesteDeathlongeffect.mp3"
import dramaticDeathMusic from "../../assets/daysounds/dramaticMusic.mp3"
import jesterDeathMusic from "../../assets/daysounds/jesterDeathEffect.mp3"
import apocalipseMusic from "../../assets/daysounds/ApocalipseVictoryMusic.mp3"
import revivalCallEffect from "../../assets/daysounds/revivalCallEffect.mp3"
import ActiveRevivalEffect from "../../assets/daysounds/ActiveRevivalEffect.mp3"
import boneBreakSoundEffect from "../../assets/daysounds/boneBreakSoundEffect.mp3"
import bombSvg from "../../assets/svgs/bomb-svg.svg"
import bulletSvg from "../../assets/svgs/bullet-svg.svg"
import wingSvg from "../../assets/svgs/wing-svg.svg"
const Day = () => {

    // sound effects
    const [playJulgamentoSound] = useSound(julgamentoSound);
    const [playFizzleSound] = useSound(bombFizzle);
    const [playBombSound] = useSound(bombBoom);
    const [PlayboneBreakSoundEffect] = useSound(boneBreakSoundEffect);
    const [playmorteSound] = useSound(morteSound);
    const [playGunSound] = useSound(gunSound);
    const [playDayMusic, { stop: stopDayMusic }] = useSound(dayMusic);
    const [playRoosterSound] = useSound(roosterEffect, { volume: 0.60 });
    const [playCancelEffectMusic] = useSound(cancelEffectMusic);
    const [playPesteDeathMusic] = useSound(pesteDeathMusic);
    const [playJesterDeathMusic] = useSound(jesterDeathMusic);
    const [playRevivalCallEffect] = useSound(revivalCallEffect, { volume: 0.60 });
    const [playActiveRevivalEffect] = useSound(ActiveRevivalEffect, { volume: 0.60 });
    const [playDramaticDeathMusic, { stop: stopDramaticDeathMusic }] = useSound(dramaticDeathMusic);
    const [playApocalipseMusic] = useSound(apocalipseMusic);
    const [isOpen, setIsOpen] = useState(true);
    const [judgementPanelIsOpen, setJudgementPanelIsOpen] = useState(false);
    const [adminPanelIsOpen, setAdminPanelIsOpen] = useState(false);
    const [plaguePanelIsOpen, setPlaguePanelIsOpen] = useState(false);
    const [jesterPanelIsOpen, setJesterPanelIsOpen] = useState(false);
    const [killPanelIsOpen, setKillPanelIsOpen] = useState(false);
    const [apocalipsePanelIsOpen, setApocalipsePanelIsOpen] = useState(false);
    const [is2ModalOpen, setIs2ModalOpen] = useState(false);
    const [isReviveModalOpen, setIsReviveModalOpen] = useState(false);
    const [notifierNewsIsOpen, setNotifierNewsIsOpen] = useState(false);
    const [updatePanelInfo, setUpdatePanelInfo] = useState(false);
    const [posiviteCounter, setPosiviteCounter] = useState(0)
    const [negativeCounter, setNegativeCounter] = useState(0)
    const [notifierNews, setNotifierNews] = useState('')
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townies, setTownies] = useState([]);
    const [mafiaies, setMafiaies] = useState([]);
    const [covenies, setCovenies] = useState([]);
    const [neutraies, setNeutraies] = useState([]);
    const [horsies, setHorsies] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [currentDayTemp, setCurrentDayTemp] = useState([]);
    const [currentDay, setCurrentDay] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [allPublicEvents, setAllPublicEvents] = useState([]);
    const navigateToNight = useNavigate();
    const [playerKilling, setPlayerKilling] = useState('');
    const [playerKilling2, setPlayerKilling2] = useState('');
    const [killAnouncementUpdate, setKillAnouncementUpdate] = useState('');
    
    


    // Night actions that transfers to morning
    const [visitAction, setVisitAction] = useState([]);
    const [executorAction, setExecutorAction] = useState([]);
    const [poisonAction, setPoisonAction] = useState([]);
    const [armadilheiroInformation, setArmadilheiroInformation] = useState([]);
    const [spyInformation, setSpyInformation] = useState([]);
    const [fuxiqueiraInformation, setFuxiqueiraInformation] = useState([]);
    const [padeiraHealCount, setPadeiraHealCount] = useState(0)
    const [arsonTarget, setArsonTarget] = useState([]);
    const [statusAfliction, setStatusAfliction] = useState([]);
    const [parasiteTarget, setParasiteTarget] = useState([]);
    
    useEffect(() => {
        const loadUserInformation = () => {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
        }
    
        
        loadUserInformation();
    }, [])
    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/${user.email}`), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        key: doc.id,
                        playerName: doc.data().playerName,
                        victoryPoints: doc.data().victoryPoints,
                        role: doc.data().role,
                        filliation: doc.data().filliation,
                        life: doc.data().life,
                        action: doc.data().action,
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setPlayers(list);
                setAlivePlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("alive")))
                setDeadPlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("dead")))
                setTownies(list.filter(player => player.filliation === 'town' && player.life === "alive"))
                setCovenies(list.filter(player => player.filliation === 'coven' && player.life === "alive"))
                setMafiaies(list.filter(player => player.filliation === 'mafia' && player.life === "alive"))
                setNeutraies(list.filter(player => player.filliation === 'neutral' && player.life === "alive"))
                setHorsies(list.filter(player => player.filliation === 'horsemen' && player.life === "alive"))
            })
            const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "town",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setTownRole(roles)
    
            })
            const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/mafia"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "mafia",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setMafiaRole(roles);
            })
            const covenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "coven",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setCovenRole(roles);
                
            })
            const horsemenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "horsemen",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setHorsemenRole(roles);
                
            })
            const neutralSnapshot = onSnapshot(collection(database, "gamedata/roles/neutral"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "neutral",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setNeutralRole(roles);
                
            })
            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/dayCounter/dayCounter`), (snapshot) => {
                const currentDayx = [];
                snapshot.forEach((doc) => {

                    currentDayx.push({ currentDay: doc.data().currentDay })

                })
                
                setCurrentDay(currentDayx[0].currentDay)
                setCurrentDayTemp(currentDayx)
            })
        }
    
        loadPlayers();
    }, [user.email]);
    useEffect(() => {
    
        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole);
    }, [covenRole])

    useEffect(() => {
        const importData = () => {
            const aflictionData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, status: doc.data().status, key: doc.id, id: doc.id });
                })
                setStatusAfliction(temp)
            })
            const executorData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/executorTarget/executorTarget`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, key: doc.id, id: doc.id });
                })
                setExecutorAction(temp)
            })
            const arsonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().playerName, key: doc.id, id: doc.id });
                })
                setArsonTarget(temp)
            })
            const armadilheiroData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`), (snapshot) => {
                let he = [];
                snapshot.forEach((doc) => {
                    he.push({ role: doc.data().role, key: doc.id, id: doc.id });
                })
                setArmadilheiroInformation(he)
            })
            const spyData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ visited: doc.data().visited, key: doc.id, id: doc.id });
                })
                setSpyInformation(her)
            })
            const fuxiqueiraData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/fuxiqueiraInformation/fuxiqueiraInformation`), (snapshot) => {
                let ter = [];
                snapshot.forEach((doc) => {
                    ter.push({ visited: doc.data().visited, key: doc.id, id: doc.id });
                })
                setFuxiqueiraInformation(ter)
            })
            const poisonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ target: doc.data().visited, key: doc.id, id: doc.id });
                })
                setPoisonAction(her)
            })
            const parasiteData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ target: doc.data().playername, key: doc.id, id: doc.id });
                })
                setParasiteTarget(her)
            })
            const visitData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        visitor: doc.data().visitor,
                        target: doc.data().target,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setVisitAction(temp);
            })
            const annoucedData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`), (snapshot) => {
                let lol = [];
                snapshot.forEach((doc) => {
                    lol.push({
                        killedPlayer: doc.data().killedPlayer,
                        killedPlayerRole: doc.data().killedPlayerRole,
                        attackerRole: doc.data().attackerRole,
                        key: doc.id,
                        id: doc.id
                    })
                })
                setAnnouncements(lol);
            })
            const publicEvents = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        target: doc.data().target,
                        event: doc.data().event,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllPublicEvents(temp);
            })
        }
        importData();
    }, [user.email])
    const endGameCompletely = async () => {
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'false' })
        for (let p = 0; p < statusAfliction.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[p].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < allPublicEvents.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`, allPublicEvents[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < announcements.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            await deleteDoc(theRef)

        }
        // for (let i = 0; i < deadPlayers.length; i++) {
        //     await updateDoc(doc(database, "playeradmin", "players", user.email, deadPlayers[i].id), { life: "none", filliation: "none", role: "none" })

        // }
        for (let i = 0; i < executorAction.length; i++) {
            await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "executorTarget", "executorTarget", "executorTarget"), { target: '' })

        }
        for (let i = 0; i < arsonTarget.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`, arsonTarget[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < poisonAction.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`, poisonAction[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < parasiteTarget.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`, parasiteTarget[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < armadilheiroInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`, armadilheiroInformation[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < spyInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`, spyInformation[i].id)
            await deleteDoc(theRef)

        }
        
        for (let i = 0; i < fuxiqueiraInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/fuxiqueiraInformation/fuxiqueiraInformation`, fuxiqueiraInformation[i].id)
            await deleteDoc(theRef)

        }
        clearNeedlessData();
        stopDayMusic();
        stopDramaticDeathMusic();

        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: 1 })
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "padeiraHeals", "padeiraHeals", "padeiraHeals"), { healCountMax: 4 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "weaponChoice", "weaponChoice", "weaponChoice"), { weapon: "none" });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "conselheiraCounter", "conselheiraCounter", "conselheiraCounter"), { counter: 2 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "investigatorCounter", "investigatorCounter", "investigatorCounter"), { counter: 2 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "zeladorCounter", "zeladorCounter", "zeladorCounter"), { counter: 2 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "veteranCounter", "veteranCounter", "veteranCounter"), { counter: 2 });
        
        navigateToNight('/playerlist')
    }
    const clearNeedlessData = () => {
        // clears visitAction
        for (let p = 0; p < visitAction.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`, visitAction[p].id)
            deleteDoc(theRef);
        }
        // clears bomb, marks, motivations and parasites.
        const bombClear = statusAfliction.filter(status => { return status.status === 'bomba' })
        const markClear = statusAfliction.filter(status => { return status.status === 'marcado' })
        const motivateClear = statusAfliction.filter(status => { return status.status === 'motivado' })
        const parasiteClear = statusAfliction.filter(status => { return status.status === 'parasita' })
        const chantagemClear = statusAfliction.filter(status => { return status.status === 'chantageado' })
        for (let p = 0; p < bombClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, bombClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < chantagemClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, chantagemClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < markClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, markClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < motivateClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, motivateClear[p].id)
            deleteDoc(theRef)
        }
        for (let i = 0; i < announcements.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            deleteDoc(theRef);
        }
        for (let i = 0; i < allPublicEvents.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`, allPublicEvents[i].id)
            deleteDoc(theRef)

        }
        for (let i = 0; i < armadilheiroInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`, armadilheiroInformation[i].id)
            deleteDoc(theRef)

        }
        for (let i = 0; i < spyInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`, spyInformation[i].id)
            deleteDoc(theRef)

        }
        for (let i = 0; i < fuxiqueiraInformation.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/fuxiqueiraInformation/fuxiqueiraInformation`, fuxiqueiraInformation[i].id)
            deleteDoc(theRef)

        }
        if (currentDay > 4) {
            for (let p = 0; p < parasiteClear.length; p++) {
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, parasiteClear[p].id)
                deleteDoc(theRef)
            }
        }
    }
    const explodeBomb = () => {
        for (let i = 0; i < statusAfliction.length; i++) {

            if (statusAfliction[i].status === 'bomba') {
                let num = Math.random();
                const targetted = alivePlayers.filter(target => { return target.playerName === statusAfliction[i].target })
                
                if (num < 0.75) {
                    playBombSound();
                    setTimeout(() => {
                        setKillPanelIsOpen(true);
                        updateDoc(doc(database, "playeradmin", "players", user.email, targetted[0].id), { life: "dead" })

                    }, 9000);
                    setKillAnouncementUpdate(`O jogador ${targetted[0].playerName} explodiu. Sua função era ${targetted[0].role}`)

                } else {
                    playFizzleSound();
                }
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[i].id)
                deleteDoc(theRef)
                document.getElementById('innerbomb').disabled = true;

                return;
            }
        }
    }
    const explodeMark = () => {
        for (let i = 0; i < statusAfliction.length; i++) {
            if (statusAfliction[i].status === 'marcado') {
                const targetted = alivePlayers.filter(target => { return target.playerName === statusAfliction[i].target })

                playGunSound();
                updateDoc(doc(database, "playeradmin", "players", user.email, targetted[0].id), { life: "dead" })
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[i].id)
                deleteDoc(theRef)
                return;
            }
        }
    }
    const revivePlayer = () => {
        setIsReviveModalOpen(false);
        const target = deadPlayers.filter(player => { return player.playerName === playerKilling });
        const martir = alivePlayers.filter(player => player.role === 'martir')
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "alive" });
        updateDoc(doc(database, "playeradmin", "players", user.email, martir[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        setKillAnouncementUpdate(`O jogador ${target[0].playerName} foi ressucitado, o mártir ${martir[0].playerName} se sacrificou por essa troca.`)

        playActiveRevivalEffect();
    }
    const revivePopup = () => {
        playRevivalCallEffect();
        setIsReviveModalOpen(true)
        stopDayMusic();
        stopDramaticDeathMusic();
    }
    const startNight = () => {
        clearNeedlessData();
        stopDayMusic();
        stopDramaticDeathMusic();
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'sleep' })
        navigateToNight('/night');
    }
    const judgement = () => {
        setJudgementPanelIsOpen(true);
        playJulgamentoSound();
        stopDayMusic();
    }
    const killPlayer = () => {
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" })

    }
    const playerjudgementAction = () => {
        if (posiviteCounter > negativeCounter) {
            playmorteSound();
            const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
            updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" })
            setJudgementPanelIsOpen(false);
            if (target[0].role === 'peste') {
                setTimeout(() => {
                    stopDayMusic();
                    playPesteDeathMusic();
                    setPlaguePanelIsOpen(true)
                }, 5000)
            } else {
                if (target[0].role === 'bobo da corte') {
                    setTimeout(() => {
                        stopDayMusic();
                        playJesterDeathMusic();
                        setJesterPanelIsOpen(true);
                    }, 5000)
                }
                else {
                    setKillPanelIsOpen(true);
                    setKillAnouncementUpdate(`O jogador ${target[0].playerName} foi julgado. Sua função era ${target[0].role}`)
                    setTimeout(() => {
                        playDramaticDeathMusic();
                    }, 5000);
                }
            }
            const executorStatus = statusAfliction.filter(status => status.status === 'executação');

            if (executorStatus.length > 0) {
            let execTarget = alivePlayers.filter(player => player.playerName === executorStatus[0].target);
                if (execTarget[0].playerName === target[0].playerName) {
                    const executor = alivePlayers.filter(player => player.role === 'executor');

                    setNotifierNews('O Alvo do executor acabou de ser executado. Executor ganhou sua parte do jogo!')
                    setNotifierNewsIsOpen(true);
                    deleteDoc(doc(database, "playeradmin", "playerStatuses", user.email, "statusAfliction", "statusAfliction", executorStatus[0].id));
                    updateDoc(doc(database, "playeradmin", "players", user.email, executor[0].id), { role: 'executor vitorioso' });
                }
            }
        } else {
            setJudgementPanelIsOpen(false);
            playCancelEffectMusic();
            setTimeout(() => {
                playDayMusic();
            }, 2000);
        }
        setPosiviteCounter(0);
        setNegativeCounter(0);
    }
    const savePlayer = () => {
        setJudgementPanelIsOpen(false);
        setTimeout(() => {
            playDayMusic();
        }, 2000);
    }
    const dayPrompt = () => {
        setIsOpen(false);
        playRoosterSound();
        setTimeout(() => {
            playDayMusic();

        }, 3000);
    }
    const executorCheck = () => {
        const executor = alivePlayers.filter(player => player.role === 'executor');
        const executorStatus = statusAfliction.filter(status => status.status === 'executação');
        if (executorStatus.length > 0) {
            let execTarget = alivePlayers.filter(player => player.playerName === executorStatus[0].target);
            if (execTarget.length === 0) {
                setUpdatePanelInfo('O alvo do executor morreu, ele agora virou Bobo da corte!');

                updateDoc(doc(database, "playeradmin", "players", user.email, executor[0].id), { role: 'bobo da corte' });
                deleteDoc(doc(database, "playeradmin", "playerStatuses", user.email, "statusAfliction", "statusAfliction", executorStatus[0].id));
    
            }
        };
        if (executor.length > 0) {
            updateDoc(doc(database, "playeradmin", "players", user.email, executor[0].id), { wakeOrder: 150 });
            
        }
    }
    const dayPrompt2 = () => {
        executorCheck();
        const horsemen = alivePlayers.filter(player => player.filliation === 'horsemen');
        if (horsemen.length > 0 && currentDay === 8) {
            setIsOpen(false);
            playRoosterSound();
            setApocalipsePanelIsOpen(true)
            setTimeout(() => {
                playApocalipseMusic();
                
            }, 3000);
        } else {
            setIsOpen(false);
            setIs2ModalOpen(true);
            playRoosterSound();
            setTimeout(() => {
                playDayMusic();
                
            }, 3000);
        }
    }
    const adminPanel = () => {
        setAdminPanelIsOpen(true);
    }

    const plagueMurder = () => {
        setPlaguePanelIsOpen(false);
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        const target2 = alivePlayers.filter(player => { return player.playerName === playerKilling2 });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" });
        updateDoc(doc(database, "playeradmin", "players", user.email, target2[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        setKillAnouncementUpdate(`Os jogadores ${target[0].playerName} e ${target2[0].playerName} morreram com a peste bubônica. Suas funções eram: ${target[0].role} e ${target2[0].role} respectivamente.`)
        playDramaticDeathMusic();
    }
    const jesterMurder = () => {
        setJesterPanelIsOpen(false);
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        PlayboneBreakSoundEffect();
        setKillAnouncementUpdate(`O jogador ${target[0].playerName} morreu com a brincadeira do Bobo da Corte. Sua função era: ${target[0].role}.`)
        playDramaticDeathMusic();
    }
    const finalizeReadings = () => {
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'false' })
        setIs2ModalOpen(false)
    }
    return (
        <div className="day">

            <h3 className="page-title">
                Dia {currentDay}
            </h3>

            <div className="dayMain">
                <Popup open={isOpen} modal closeOnDocumentClick={false}>
                {currentDay === 1 ? (
                    <div className="modalNight">
                    <div className="header">Para iniciar o dia, clique abaixo! </div>
                    <div className="content">

                        <button className="button" onClick={dayPrompt}>Iniciar Dia</button>
                        <div className="contentRead">

                        </div>
                    </div>
                    </div>
                    ) : (
                        <div className="modalNight">
                        <div className="header">Para começar o dia, clique abaixo! </div>
                        <div className="content">
  
                            <button className="button" onClick={dayPrompt2}>Iniciar Dia</button>

                        </div>
                        </div>
                        )}
                    
                </Popup>
                <Popup open={is2ModalOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Leia os Acontecimentos e siga a ordem! </div>
                        <div className="contentRead">
                            {announcements.length > 0 ? (
                                <span className="modalNotifier fade-in-text1">
                                    <h4 className="notifier-title">Mortes esta noite:</h4>
                                    {announcements.map((announcement) => (
                                        <span key={announcement.key} className="announcePlace">
                                            <p className="announcePlace-announce"> O Jogador: {announcement.killedPlayer} morreu</p>
                                            <p className="announcePlace-function"> Sua Função era: {announcement.killedPlayerRole}</p>
                                            <p className="announcePlace-killer"> Quem o Matou: {announcement.attackerRole}</p>
                                        </span>
                                    ))}
                                    </span>
                            ) : (
                                    <span className="modalNotifier fade-in-text1">
                                        <h4 className="notifier-title">Mortes esta noite:</h4>
                                        <p>Não houve mortes essa noite</p>   

                                    </span>
                            )}
                                <span className="modalNotifier fade-in-text2 ">
                                    <h4 className="notifier-title ">Efeitos Públicos:</h4>
                                    {allPublicEvents.map((event) => (
                                        <span className="statusPlace statusPlaceModal" key={event.key}>
                                                <p className="statusPlace-player">{event.target}</p>
                                                <p className="statusPlace-estado">tem o efeito</p>
                                                <p className="statusPlace-evento">{event.event}</p>
                                            {event.event === 'bomba' && (
                                                <button className="smallButton" id="innerbomb" onClick={explodeBomb}><img src={bombSvg}></img></button>

                                            )}
                                                </span>      
                                    ))}
                                <span>
                                    {updatePanelInfo}
                                </span>
                                </span>
                            {armadilheiroInformation.length > 0 && 
                                <span className="modalNotifier fade-in-text2 ">
                                <h4 className="notifier-title ">Efeito do Armadilheiro:</h4>
                                {armadilheiroInformation.map((info) => (
                                <span>
                                        {info.role !== "armadilheiro" && (
                            <span key={info.key} className="armadilhaPlace">
                            <p className="armadilhaPlace-visitor">{info.role}</p>
                            <p className="armadilhaPlace-text">ativou a armadilha!</p>
                            </span> )}
                            </span>                                        
                                    ))}
                                </span>
                            }
                            {spyInformation.length > 0 ? (
                                <span className="modalNotifier fade-in-text2 ">
                                <h4 className="notifier-title ">Efeito do Espião:</h4>
                                {spyInformation.map((info) => (
                                    <p key={info.key}>Seu alvo visitou {info.visited}!</p>
                                    ))}
                                </span>

                            ) : (
                                <span className="modalNotifier fade-in-text2 ">
                                </span>
                            )
                            }
                            {fuxiqueiraInformation.length > 0 ? (

                                <span className="modalNotifier fade-in-text2 ">
                                    <h4 className="notifier-title ">Efeito da Fuxiqueira:</h4>
                                    <span className="direto">
                                    <p>Os Jogadores: </p>
                                {fuxiqueiraInformation.map((info) => (
                                    <p key={info.key}> {info.visited} </p>
                                ))}
                                        <p>possivelmente visitaram seu alvo!</p>
                                    </span>
                                </span>
                            ) : (
                                <span className="modalNotifier fade-in-text2 ">
                                </span>
                                )}
                            <button className="button" onClick={() => finalizeReadings()}>Finalizar</button>
                    </div>    
                </div>
                </Popup>
                <div className="event-ocurrence event">
                        <h4>
                        Acontecimentos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {announcements.map((announcement) => (
                            <span key={announcement.key} className="announcePlace">
                                <p className="announcePlace-announce"> {announcement.killedPlayer} morreu</p>
                                 <p className="announcePlace-function"> Função: {announcement.killedPlayerRole}</p>
                                <p className="announcePlace-killer"> Ataque: {announcement.attackerRole}</p>
                            </span>
                        ))}
                        {allPublicEvents.map((event) => (
                            <span className="statusPlace" key={event.key}>
                                <p className="statusPlace-player">{event.target}</p>
                                <p className="statusPlace-estado">tem o efeito</p>
                                <p className="statusPlace-evento">{event.event}</p>
                            </span>
                        ))}
                        {armadilheiroInformation.map((info) => (
                            <span key={info.key} className="armadilhaPlace">
                            {info.role !== "armadilheiro" && (
                            <span key={info.key} className="armadilhaPlace">
                            <p className="armadilhaPlace-visitor">{info.role}</p>
                            <p className="armadilhaPlace-text">ativou a armadilha!</p>
                            </span> )}
                            </span>
                        ))}
                        {spyInformation.map((info) => (
                            <p key={info.key}>O Espião percebeu que seu alvo visitou {info.visited}!</p>
                        ))}
                        {fuxiqueiraInformation.map((info) =>(
                                    <p key={info.key}> {info.visited} pode ter visitado o alvo da fuxiqueira </p>
                        ))}
                        </div>
                </div>
                <div className="event-hiddenocurrence event">
                        <h4>
                        Ações da Noite
                        </h4>
                    <div className="card-border scrollable event-hiddenocurrence-inner">
                        {visitAction.map((visit) => (
                            <span className="visitPlace" key={visit.key}>
                            <p className="visitPlace-visitee">{visit.visitor}</p>
                            <p>V</p>
                            <p className="visitPlace-visited">{visit.target}</p>
                            </span>
                    ))}    
                    </div>
                </div>
                <div className="event-status event">
                        <h4>
                        Informações Secretas
                        </h4>
                    <div className="large-container card-border scrollable">

                        {statusAfliction.map((player) => (
                            <span key={player.key + '4'} className="statusAflictions">
                                <p className="statusAfliction-player">{player.target}</p>
                                <p className="statusAfliction-estado">tem o efeito</p>
                                <p className="statusAfliction-evento">{player.status} </p>
                                {player.status === 'marcado' && <button className="miniButton trigger" onClick={explodeMark}><img src={bulletSvg} alt="bullet" /></button>}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="event-aliveplayers event">
                    <div className="alivePlayersTitle">
                        <h4>
                        Jogadores Vivos
                    </h4>
                           
                    <div className="counterBox townies"> {townies.length}</div>
                    <div className="counterBox mafiaies"> {mafiaies.length}</div>
                    <div className="counterBox covenies"> {covenies.length}</div>
                    <div className="counterBox neutraies" > {neutraies.length}</div>
                    <div className="counterBox horsies" > {horsies.length}</div>
                    </div>
                    <div className="large-container card-border scrollable">
                        {alivePlayers.map((player => (
                            <span className="alivePlayersConfig" key={player.key}>
                                {player.playerName} - {player.filliation === 'town' && <p className="townies">{player.role} </p>} {player.role === 'martir' && <button className="miniButton trigger" onClick={revivePopup}><img src={wingSvg} alt="Wings" /></button>}
                                {player.filliation === 'mafia' && <p className="mafiaies">{player.role} </p>}
                                {player.filliation === 'coven' && <p className="covenies">{player.role}</p>}
                                {player.filliation === 'neutral' && <p className="neutraies">{player.role}</p>}
                                {player.filliation === 'horsemen' && <p className="horsies">{player.role}</p>}
                            </span>
                        )))}
                        </div>
                </div>
                <div className="event-death event">
                        <h4>
                        Jogadores Mortos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {deadPlayers.map((player) => (
                            <span className="alivePlayersConfig" key={player.key + '3'}>
                                {player.playerName} -
                                {player.filliation === 'town' && <p className="townies">{player.role} </p>}
                                {player.filliation === 'mafia' && <p className="mafiaies">{player.role}</p>}
                                {player.filliation === 'coven' && <p className="covenies">{player.role}</p>}
                                {player.filliation === 'horsemen' && <p className="horsies">{player.role}</p>}
                                {player.filliation === 'neutral' && <p className="neutraies">{player.role}</p>}
                            </span>
                                    ))}
                    </div>
                </div>
                <div className="event-killplayer event">
                    <div className="event-killplayer-inner">
                        <button type="button" onClick={judgement} className="button">Julgamento</button>
                        <button type="button" onClick={startNight} className="button">Começar Noite</button>
                        <button className="button" onClick={adminPanel}>Administrativo</button>

                    </div>

                </div>                   
            </div>
            <div className="upper-page-area">
            </div>
            <Popup open={adminPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Painel Administrativo, Use apenas para EMERGENCIAS </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                        <button className="button" onClick={killPlayer}>Matar o Jogador</button>
                        <hr />
                    <button className="button" onClick={explodeMark}>Atirar na Marca</button>
                    <button className="button" onClick={explodeBomb}>Bomba do Palhaço</button>  
                    <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                    <button className="button" onClick={() => { setAdminPanelIsOpen(false) }}>Fechar Painel</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={plaguePanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Peste morreu no julgamento, mate dois jogadores </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <select name="playerName2" id="playerName2" value={playerKilling2} onChange={(e) => setPlayerKilling2(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={plagueMurder}>Matar os jogadores</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={jesterPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">O Bobo da Corte morreu! Mate 1 jogador </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={jesterMurder}>Matar os jogadores</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={isReviveModalOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">O Mártir está se sacrificando por um jogador. Seleciona alguém morto: </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {deadPlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={revivePlayer}>Reviver Jogador</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={killPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Anúncio de Morte </div>
                    <div className="contentDeathAnouncement">
                        <span>{killAnouncementUpdate}</span>
                    <button className="button" onClick={() => setKillPanelIsOpen(false)}>Ok!</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={apocalipsePanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Vitória dos Cavaleiros do Apocalipse </div>
                    <div className="contentDeathAnouncement">
                    <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={judgementPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Painel de Julgamento </div>
                    <div className="content modalNotifier modalkill">
                    <p>Selecione o jogador para ser julgado:</p>
                        <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                        <div className="voteCountMain">
                        
                        <div className="voteCountCard">

                            <label htmlFor="posiviteVotes" className="voteCountInput">A Favor</label>
                                <input name="posiviteVotes" type="number" value={posiviteCounter} onChange={(e) => setPosiviteCounter(e.target.value)} max={40} min={0}/>
                                <span className="buttoncontainer">

                                <button className="miniButton miniButtonLeft" onClick={() => {setPosiviteCounter(posiviteCounter + 1)}}> + </button>
                                <button className="miniButton miniButtonRight" onClick={() => {setPosiviteCounter(posiviteCounter - 1)}}> - </button>
                            </span>
                        </div>
                        <div className="voteCountCard">

                            <label htmlFor="negativeVotes" className="voteCountInput">Contra</label>
                                <input name="negativeVotes" type="number" value={negativeCounter} onChange={(e) => setNegativeCounter(e.target.value)} max={40} min={0}/>
                                <span className="buttoncontainer">

                                <button className="miniButton miniButtonLeft" onClick={() => {setNegativeCounter(negativeCounter + 1)}}> + </button>
                                <button className="miniButton miniButtonRight" onClick={() => {setNegativeCounter(negativeCounter - 1)}}> - </button>
                                </span>
                            
                            </div>
                        </div>
                        <button className="button" onClick={playerjudgementAction}>Confirmar Votos</button>
                        <button className="button" onClick={savePlayer}>Cancelar</button>
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={notifierNewsIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">{notifierNews}</div>
                    <div className="content">
                    <button className="button" onClick={() => setNotifierNewsIsOpen(false)}>Okay</button>
                        
                    </div>
                    </div>
                    
            </Popup>
        </div>
    )
}

export default Day;