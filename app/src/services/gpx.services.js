import { DOMParser } from 'xmldom';

export function parseFile(fileString) {
    const doc = new DOMParser().parseFromString(fileString, 'text/xml');
    const trkpts = doc.getElementsByTagName('trkpt');
    const trkptsArray = Array.from(trkpts);

    return trkptsArray.map((trkpt) => {
        return {
            latitude: parseFloat(trkpt.getAttribute('lat')),
            longitude: parseFloat(trkpt.getAttribute('lon')),
            timestamp: new Date(trkpt.getElementsByTagName('time')[0]?.textContent || 0),
            elevation: parseInt(trkpt.getElementsByTagName('ele')[0]?.textContent || 0),
        };
    });
}

export function distance2Coordonate(point1, point2) {
    if (!point1 || !point2) return Number.NaN;
    return (
        6371 *
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(
                    Math.sin(
                        ((point1.latitude * Math.PI) / 180 - (point2.latitude * Math.PI) / 180) / 2
                    ),
                    2
                ) +
                    Math.cos((point1.latitude * Math.PI) / 180) *
                        Math.cos((point2.latitude * Math.PI) / 180) *
                        Math.pow(
                            Math.sin(
                                ((point1.longitude * Math.PI) / 180 -
                                    (point2.longitude * Math.PI) / 180) /
                                    2
                            ),
                            2
                        )
            )
        )
    );
}

export function performanceStats(points) {
    const stats = {
        distanceDeltas: points
            .map((point, index) => {
                if (index === 0) return 0;
                return distance2Coordonate(point, points[index - 1]);
            })
            .slice(1),
        timeDeltas: points
            .map((point, index) => {
                if (index === 0) return 0;
                return point.timestamp.getTime() - points[index - 1].timestamp.getTime();
            })
            .slice(1),
        elevationDeltas: points
            .map((point, index) => {
                if (index === 0) return 0;
                return point.elevation - points[index - 1].elevation;
            })
            .slice(1),
        speedDeltas: points
            .map((point, index) => {
                if (index === 0) return 0;
                return (
                    distance2Coordonate(point, points[index - 1]) /
                    ((point.timestamp.getTime() - points[index - 1].timestamp.getTime()) /
                        3600 /
                        1000) // in km/h
                );
            })
            .slice(1),
    };
    stats.distance = stats.distanceDeltas.reduce((acc, curr) => acc + curr, 0);
    stats.time = stats.timeDeltas.reduce((acc, curr) => acc + curr, 0);
    stats.elevation = stats.elevationDeltas.reduce((acc, curr) => acc + Math.abs(curr), 0);
    stats.meanSpeed =
        stats.speedDeltas.reduce((acc, curr) => acc + curr, 0) / stats.speedDeltas.length;
    stats.theoricalMeanSpeed = stats.distance / (stats.time / 3600 / 1000);
    stats.maxSpeed = Math.max(...stats.speedDeltas);
    stats.minSpeed = Math.min(...stats.speedDeltas);
    return stats;
}

export function addTimeTagToGPXFile(fileString, totalTime, startDate) {
    const doc = new DOMParser().parseFromString(fileString, 'text/xml');
    const trkpts = doc.getElementsByTagName('trkpt');
    const trkptsArray = Array.from(trkpts);

    let previousTime = startDate;
    trkptsArray.forEach((trkpt, index) => {
        const time = doc.createElement('time');
        time.textContent = previousTime.toISOString();
        const etime =
            previousTime.getTime() +
            ((totalTime - (previousTime.getTime() - startDate.getTime())) /
                (trkptsArray.length - index)) *
                (index === trkptsArray.length - 1 ? 1 + Math.random() * 0.2 : 1);
        previousTime = new Date(etime);
        trkpt.appendChild(time);
    });

    return doc.toString();
}
